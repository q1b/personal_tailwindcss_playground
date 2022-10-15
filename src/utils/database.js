import { supabase } from '../../lib/supabaseClient'
import crypto from 'crypto'

export async function put(item) {
  const id = item?.ID ?? crypto.randomUUID()
  const { data, error } = await supabase
    .from('playgrounds')
    .insert(
      {
        id,
        content: JSON.stringify({
          version: item.version,
          html: item.html,
          css: item.css,
          config: item.config,
        }),
      },
      { upsert: true }
    )
    .single()

  supabase.from('playgrounds').insert(
    'commits',
    JSON.stringify({
      version: item.version,
      html: item.html,
      css: item.css,
      config: item.config,
      timestamp: new Date(),
    })
  )

  console.log('FROM PUT ', data)
  return {
    ID: id,
    ...item,
  }
}

export async function get(Key) {
  const { data, error } = await supabase
    .from('playgrounds')
    .select()
    .eq('id', Key?.ID)
    .single()

  //   console.log('FROM GET REQUEST', data, JSON.parse(data?.content))
  return { ITEM: { ...JSON.parse(data?.content ?? {}), ID: data.id } }
}
