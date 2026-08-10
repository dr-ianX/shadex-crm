// packages/frontend/optimize-assets.js
// Run from repo root: node packages/frontend/optimize-assets.js

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
