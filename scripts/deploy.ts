import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

// 1. Lint
run('npx oxlint')

// 2. Build
run('npm run build')

// 3. Increment version in package.json
const packageJsonPath = resolve(import.meta.dirname, '../package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

const oldVersion = packageJson.version
const newVersion = incrementVersion(oldVersion)
packageJson.version = newVersion

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
console.log(`\nVersion: ${oldVersion} → ${newVersion}`)

// 4. Commit and tag
const tag = `v${newVersion}`
run('git add package.json')
run(`git commit -m "${tag}"`)
run(`git tag -a ${tag} -m "${tag}"`)

// 5. Push with tag
run(`git push origin HEAD ${tag}`)

console.log(`\nDeployed ${tag}`)
