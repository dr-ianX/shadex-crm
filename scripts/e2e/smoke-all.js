const { spawnSync, spawn, execSync } = require('child_process')
const fetch = globalThis.fetch || (function(){ try { return require('node-fetch'); } catch (e) { throw new Error('fetch is not available. Install node-fetch or use Node 18+.') } })()
const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const BACKEND = path.join(ROOT, 'packages', 'backend')
const FRONTEND = path.join(ROOT, 'packages', 'frontend')
const SERVER_CMD = 'node'
const SERVER_ARGS = ['dist/index.js']
const HEALTH_URL = 'http://localhost:3001/health'

function runCmd(cmd, args, opts = {}) {
  console.log(`> ${cmd} ${args.join(' ')}`)
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: true, ...opts })
  if (r.error) throw r.error
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited with ${r.status}`)
}

async function waitForHealth(url, timeoutMs = 15000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url)
      if (r.status === 200) {
        const body = await r.json().catch(() => null)
        console.log('Health OK:', body)
        return true
      }
    } catch (e) {
      // ignore
    }
    await new Promise((res) => setTimeout(res, 500))
  }
  throw new Error('Health check did not become available in time')
}

async function main() {
  let server = null
  try {
    console.log('1) Generate Prisma client')
    runCmd('npx', ['prisma', 'generate'], { cwd: BACKEND })

    console.log('2) Build backend')
    runCmd('npm', ['run', 'build'], { cwd: BACKEND })

    console.log('3) Start backend server')
    server = spawn(SERVER_CMD, SERVER_ARGS, { cwd: BACKEND, stdio: ['ignore', 'pipe', 'pipe'], detached: false })
    console.log('  started server pid', server.pid)

    // Pipe some output
    server.stdout.on('data', (d) => process.stdout.write(`[server] ${d}`))
    server.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`))

    console.log('3) Waiting for /health')
    await waitForHealth(HEALTH_URL, 15000)

    console.log('4) Run backend smoke script')
    runCmd('node', ['scripts/smoke.js'], { cwd: BACKEND })

    console.log('5) Build frontend')
    runCmd('npm', ['run', 'build'], { cwd: FRONTEND })

    console.log('6) Verify frontend dist')
    const distIndex = path.join(FRONTEND, 'dist', 'index.html')
    if (!fs.existsSync(distIndex)) throw new Error('Frontend dist/index.html not found after build')
    console.log('Frontend build OK:', distIndex)

    console.log('E2E checks passed')
  } catch (err) {
    console.error('E2E failed:', err)
    process.exitCode = 1
  } finally {
    if (server && server.pid) {
      console.log('Stopping server pid', server.pid)
      try {
        server.kill()
      } catch (e) {
        console.warn('Graceful kill failed, attempting force kill:', e && e.message)
        try { process.kill(server.pid, 'SIGKILL') } catch (e2) { /* ignore */ }
      }

      // Wait up to 5s for exit
      await new Promise((resolve) => {
        let done = false
        server.on('exit', () => { done = true; resolve() })
        setTimeout(() => { if (!done) resolve() }, 5000)
      })
      console.log('Server stopped')
    }
    if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode)
  }
}

main()
