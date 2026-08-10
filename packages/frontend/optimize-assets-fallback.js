// Fallback asset optimizer: copies the original logo to multiple files (no resizing)
// Run: node packages/frontend/optimize-assets-fallback.js
const fs = require('fs')
const path = require('path')
const src = path.join(__dirname, 'public', 'assets', 'shadex-logo.png')
const sizes = [48, 96, 192, 512]

if (!fs.existsSync(src)) {
  console.error('Source logo not found:', src)
  process.exit(1)
}

for (const s of sizes) {
  const out = path.join(__dirname, 'public', 'assets', `shadex-logo-${s}.png`)
  try {
    fs.copyFileSync(src, out)
    console.log('Created (copied):', out)
  } catch (err) {
    console.error('Failed to create', out, err)
  }
}
console.log('Fallback asset copies created (no resizing). To produce resized images, install sharp and run optimize-assets.js')
