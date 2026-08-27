import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline'

function run(cmd: string) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { stdio: 'inherit' })
}

function incrementVersion(version: string): string {
  const match = version.match(/^(.+[-.])?(\d+)$/)

  if (!match) {
    throw new Error(`Cannot increment version: ${version}`)
  }

  const prefix = match[1] ?? ''
  const number = parseInt(match[2], 10) + 1

  return `${prefix}${number}`
}

/**
 * Incrementing only ever bumps the trailing number (`1.0.0-beta.98` → `1.0.0-beta.99`), so a
 * release that changes anything else — leaving a prerelease, a minor or a major — has to be named
 * explicitly: `npm run deploy -- 1.0.0`. Add `--yes` to skip the confirmation prompt.
 */
function resolveNextVersion(currentVersion: string, requestedVersion: string | undefined): string {
  if (requestedVersion === undefined) {
    return incrementVersion(currentVersion)
  }

  const version = requestedVersion.replace(/^v/, '')

  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Invalid version "${requestedVersion}", expected e.g. 1.0.0 or 1.1.0-beta.1`)
  }

  if (version === currentVersion) {
    throw new Error(`Version ${version} is already the current version`)
  }

  return version
}

/**
 * `--yes` skips the confirmation for non-interactive runs. Without it the prompt needs a terminal:
 * on a closed or piped stdin readline never answers and the process just exits mid-await, so that
 * case is refused up front instead.
 */
const args = process.argv.slice(2)
const skipConfirmation = args.includes('--yes')
const requestedVersion = args.find((arg) => !arg.startsWith('--'))

async function confirm(question: string): Promise<boolean> {
  if (skipConfirmation) {
    return true
  }

  if (!process.stdin.isTTY) {
    throw new Error('Not running in a terminal — pass --yes to publish without the confirmation prompt')
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await new Promise<string>((resolve) => rl.question(question, resolve))
  rl.close()

  return answer.trim().toLowerCase() !== 'n'
}

// 1. Lint
run('npx oxlint')

// 2. Build
run('npm run build')

// 3. Resolve the next version — nothing is written until the release is confirmed, so an aborted
//    or interrupted run leaves package.json untouched
const packageJsonPath = resolve(import.meta.dirname, '../package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const oldVersion = packageJson.version
const newVersion = resolveNextVersion(oldVersion, requestedVersion)
const tag = `v${newVersion}`
console.log(`\nVersion: ${oldVersion} → ${newVersion}`)

// 4. Confirm before touching anything
if (!(await confirm(`\nPublish ${tag}? (Y/n) `))) {
  console.log('Aborted.')
  process.exit(0)
}

// 5. Write the version, commit and tag
packageJson.version = newVersion
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

run('git add package.json')
run(`git commit -m "${tag}"`)
run(`git tag -a ${tag} -m "${tag}"`)

// 6. Push with tag
run(`git push origin HEAD ${tag}`)

console.log(`\nDeployed ${tag}`)
