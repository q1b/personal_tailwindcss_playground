import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export async function getDefaultContent() {
  const html = `<!--
  Forked from playground provided by tailwindcss,
  Just now you can use, this fancy component \`map\` in your markup
  So, you can also do stuff which is usually impossible to do,

  Just in case you, here is Twitter Username \`XSukhpreet\`
-->
<div class="bg-slate-900 min-h-screen flex items-center justify-center gap-4">
  <ul class="list-disc border px-2 py-3 list-inside rounded-lg">
    <map 
        {color: "rose", shade:"400", ref: "Blood"}
        {color: "lime", shade:"600", ref: "Leaf"} 
        {color: "blue", shade:"800", ref: "Sea"} 
        {color: "cyan", shade:"200", ref: "Sky"}
        {color: "orange", shade:"400", ref: "SUN"} 
        as item>
      <li class="text-{item.color}-{item.shade}">
        {item.ref} is {item.color} 
      </li>
    </map>
  </ul>
</div>
`
  const css = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'
  const config = `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // ...
    },
  },
  plugins: [],
}\n`

  let { css: compiledCss } = await postcss([
    tailwindcss({
      content: [{ raw: html }],
    }),
    autoprefixer(),
    cssnano({ preset: ['default', { discardComments: { removeAll: true } }] }),
  ]).process(css, {
    from: undefined,
  })

  return {
    html,
    css,
    config,
    compiledCss,
  }
}
