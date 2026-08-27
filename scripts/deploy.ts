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
 * explicitly: `npm run deploy -- 1.0.0`.
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

// 1. Lint
run('npx oxlint')

// 2. Build
run('npm run build')

// 3. Increment version in package.json
const packageJsonPath = resolve(import.meta.dirname, '../package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const oldVersion = packageJson.version
const newVersion = resolveNextVersion(oldVersion, process.argv[2])
packageJson.version = newVersion

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
const tag = `v${newVersion}`
console.log(`\nVersion: ${oldVersion} → ${newVersion}`)

// 4. Confirm before publishing
const rl = createInterface({ input: process.stdin, output: process.stdout })
const answer = await new Promise<string>((resolve) => rl.question(`\nPublish ${tag}? (Y/n) `, resolve))
rl.close()

if (answer.trim().toLowerCase() === 'n') {
  // Revert package.json version change
  packageJson.version = oldVersion
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  console.log('Aborted. Version reverted.')
  process.exit(0)
}

// 5. Commit and tag
run('git add package.json')
run(`git commit -m "${tag}"`)
run(`git tag -a ${tag} -m "${tag}"`)

// 6. Push with tag
run(`git push origin HEAD ${tag}`)

console.log(`\nDeployed ${tag}`)
