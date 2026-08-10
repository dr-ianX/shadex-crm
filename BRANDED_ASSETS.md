# Branded Assets & Generation Guide

Existing assets in repository:
- packages/frontend/public/assets/shadex-logo.jpg
- packages/frontend/public/assets/shadex-logo.png
- packages/frontend/public/assets/shadex-logo-print.png
- packages/frontend/public/assets/shadex-logo.svg

Recommended local steps to prepare optimized web assets:

1) Install sharp (node) locally to generate optimized variants:
   cd packages/frontend
   npm install sharp --save-dev

2) Example Node script (packages/frontend/optimize-assets.js):

```js
// packages/frontend/optimize-assets.js
// Generates PNG variants (48,96,192,512) from the main PNG using sharp when available.
(async () => {
  try {
    const sharp = require('sharp')
    const path = require('path')
    const src = path.join(__dirname, 'public', 'assets', 'shadex-logo.png')
    const sizes = [48, 96, 192, 512]
    for (const s of sizes) {
      const out = path.join(__dirname, 'public', 'assets', `shadex-logo-${s}.png`)
      console.log(`Generating ${out}`)
      await sharp(src).resize(s).png({ quality: 90 }).toFile(out)
    }
    console.log('Optimized assets generated')
  } catch (err) {
    console.error('Sharp not available or failed to run. Install with: npm install sharp --save-dev')
    process.exit(1)
  }
})()
```

3) ImageMagick alternative (if installed):
   convert packages/frontend/public/assets/shadex-logo.png -resize 192x192 packages/frontend/public/assets/shadex-logo-192.png

4) SVG usage: prefer .svg for browsers when possible; use PNG fallbacks for older clients.

5) Where to reference in code:
- Favicon and meta tags: packages/frontend/index.html
- Header and login pages: src/components/Header.tsx and src/pages/Login.tsx

Notes:
- The repo already contains the primary logos. No binary copying required unless you want a separate branded docs folder.
- If you want copies in a docs/branding folder, confirm and Scarlett will create web-optimized versions there.

Additional automated helpers added:
- packages/frontend/optimize-assets-fallback.cjs — fallback that copies the primary PNG into multiple filenames when native image tooling (sharp) is not available. Use as: node packages/frontend/optimize-assets-fallback.cjs
- To produce properly resized images, install sharp and run: node packages/frontend/optimize-assets.js

Fonts & theme:
- index.html already loads Inter from Google Fonts. If you want additional fonts (e.g., Roboto, Poppins) confirm which Google Fonts to add and Scarlett will update index.html and CSS tokens accordingly.
