const { spawn } = require('child_process')
const path = require('path')

const ROOT = process.cwd()
const BACKEND = path.join(ROOT, 'packages', 'backend')
const FRONTEND = path.join(ROOT, 'packages', 'frontend')

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
    p.on('error', reject)
    p.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function main() {
  try {
    console.log('Generating Prisma client...')
    await run('npx', ['prisma', 'generate'], { cwd: BACKEND })

    console.log('Building backend...')
    await run('npm', ['run', 'build'], { cwd: BACKEND })

    console.log('Building frontend...')
    await run('npm', ['run', 'build'], { cwd: FRONTEND })

    console.log('Starting backend (node dist/index.js)')
    const backendProc = spawn('node', ['dist/index.js'], { cwd: BACKEND, stdio: ['ignore', 'pipe', 'pipe'], shell: true })
    backendProc.stdout.on('data', (d) => process.stdout.write(`[backend] ${d}`))
    backendProc.stderr.on('data', (d) => process.stderr.write(`[backend] ${d}`))

    console.log('Starting frontend preview (vite preview --port 3000)')
    const frontendProc = spawn('npx', ['vite', 'preview', '--port', '3000'], { cwd: FRONTEND, stdio: ['ignore', 'pipe', 'pipe'], shell: true })
    frontendProc.stdout.on('data', (d) => process.stdout.write(`[frontend] ${d}`))
    frontendProc.stderr.on('data', (d) => process.stderr.write(`[frontend] ${d}`))

    function shutdown() {
      console.log('Shutting down child processes...')
      try { backendProc.kill() } catch (e) {}
      try { frontendProc.kill() } catch (e) {}
      process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)

    // keep running until terminated by Playwright
    await new Promise(() => {})
  } catch (err) {
    console.error('Failed to start servers for Playwright:', err)
    process.exit(1)
  }
}

main()
