import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkAttr from 'remark-attr'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const processor = unified()
  .use(remarkParse)
  .use(remarkAttr)
  .use(remarkRehype)
  .use(rehypeStringify)

function parse(value) {
  return processor.runSync(processor.parse(value))
}

export default parse
