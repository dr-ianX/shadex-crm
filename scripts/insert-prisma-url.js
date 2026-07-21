const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'packages', 'backend', 'prisma', 'schema.prisma');
const dst = path.join(__dirname, '..', 'packages', 'backend', 'prisma', 'schema.withurl.prisma');
let s = fs.readFileSync(src, 'utf8');
const needle = 'provider = "postgresql"';
const idx = s.indexOf(needle);
if (idx === -1) {
  console.error('Provider line not found');
  process.exit(1);
}
const before = s.substring(0, idx + needle.length);
const after = s.substring(idx + needle.length);
const insert = '\n  url      = env("DATABASE_URL")';
const out = before + insert + after;
fs.writeFileSync(dst, out, 'utf8');
console.log('Wrote', dst);
