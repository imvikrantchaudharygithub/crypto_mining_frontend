const [url, ...wantTypes] = process.argv.slice(2)
if (!url) { console.error('usage: node scripts/seo-check.mjs <url> <type...>'); process.exit(2) }

const html = await fetch(url).then(r => r.text())
const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => m[1])

const types = new Set()
let parseError = null
for (const b of blocks) {
  try {
    const json = JSON.parse(b)
    const arr = Array.isArray(json) ? json : [json]
    for (const node of arr) if (node && node['@type']) types.add(node['@type'])
  } catch (e) { parseError = e.message }
}

console.log(`Found ${blocks.length} JSON-LD block(s). Types: [${[...types].join(', ')}]`)
if (parseError) { console.error('Invalid JSON-LD:', parseError); process.exit(1) }

const missing = wantTypes.filter(t => !types.has(t))
if (missing.length) { console.error('MISSING types:', missing.join(', ')); process.exit(1) }
console.log('OK — all required types present')
