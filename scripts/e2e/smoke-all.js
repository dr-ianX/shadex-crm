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

function findPidByPort(port) {
  const isWin = process.platform === 'win32'
  try {
    if (isWin) {
      // netstat output lines, parse last token as PID
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
      const lines = out.trim().split(/\r?\n/).filter(Boolean)
      for (const line of lines) {
        const cols = line.trim().split(/\s+/)
        const pid = cols[cols.length - 1]
        if (pid && !isNaN(Number(pid))) return Number(pid)
      }
      return null
    } else {
      // try lsof -t first
      try {
        const out = execSync(`lsof -i :${port} -t`, { encoding: 'utf8' })
        const pid = out.trim().split(/\r?\n/)[0]
        return pid ? Number(pid) : null
      } catch (e) {
        // fallback to ss parsing
        try {
          const out2 = execSync(`ss -ltnp`, { encoding: 'utf8' })
          const lines = out2.trim().split(/\r?\n/)
          for (const line of lines) {
            if (line.includes(`:${port} `) || line.includes(`:${port}\n`)) {
              const m = line.match(/pid=(\d+)/)
              if (m) return Number(m[1])
            }
          }
        } catch (e2) {
          return null
        }
      }
      return null
    }
  } catch (err) {
    return null
  }
}

async function killPid(pid, timeout = 5000) {
  if (!pid) return
  try {
    console.log('Attempting to gracefully kill PID', pid)
    process.kill(pid)
  } catch (e) {
    console.log('Graceful kill failed or not permitted:', e && e.message)
  }
  // wait for process to exit
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try { process.kill(pid, 0); /* still exists */ } catch (e) { return true }
    await new Promise((r) => setTimeout(r, 200))
  }
  // force kill
  try {
    console.log('Forcing kill PID', pid)
    process.kill(pid, 'SIGKILL')
    return true
  } catch (e) {
    console.warn('Force kill failed:', e && e.message)
    return false
  }
}

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
    // If something is already listening on the backend port, attempt to clear it to avoid EADDRINUSE races
    const existing = findPidByPort(3001)
    if (existing) {
      console.log(`Found existing process listening on port 3001: PID ${existing}. Attempting to stop it.`)
      const ok = await killPid(existing, 5000)
      if (!ok) throw new Error(`Could not kill existing process ${existing} on port 3001`) 
      console.log('Existing process terminated')
    }

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
