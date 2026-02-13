/**
 * VitePress documentation generator for vuiii library.
 * Generates markdown files from JSDoc comments in source files.
 *
 * Run with: npx jiti scripts/generate-vitepress-docs.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, basename } from 'path'

const SRC_DIR = join(import.meta.dirname, '../src')
const DOCS_DIR = join(import.meta.dirname, '../docs')

interface DocEntry {
  name: string
  type: 'component' | 'composable' | 'utility'
  description: string
  examples: string[]
  file: string
}

/**
 * Extract JSDoc comment from the beginning of a script section or file.
 */
function extractJSDoc(content: string): string {
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//)
  return jsdocMatch ? jsdocMatch[0] : ''
}

/**
 * Extract JSDoc from Vue SFC file.
 */
function extractVueJSDoc(content: string): string {
  const scriptMatch = content.match(/<script[^>]*>[\s\S]*?<\/script>/g)
  if (!scriptMatch) return ''

  for (const script of scriptMatch) {
    const jsdoc = extractJSDoc(script)
    if (jsdoc && (jsdoc.includes('@component') || jsdoc.includes('@example'))) {
      return jsdoc
    }
  }

  for (const script of scriptMatch) {
    const jsdoc = extractJSDoc(script)
    if (jsdoc) return jsdoc
  }

  return ''
}

/**
 * Parse JSDoc into structured sections.
 */
function parseJSDoc(jsdoc: string): { description: string; examples: string[] } {
  const lines = jsdoc.replace(/^\/\*\*|\*\/$/g, '').split('\n')
  const description: string[] = []
  const examples: string[] = []
  let currentExample = ''
  let inExample = false

  for (let line of lines) {
    line = line.replace(/^\s*\*\s?/, '')

    if (line.startsWith('@example')) {
      if (currentExample) examples.push(currentExample.trim())
      currentExample = ''
      inExample = true
      continue
    }

    if (line.startsWith('@') && inExample) {
      if (currentExample) examples.push(currentExample.trim())
      currentExample = ''
      inExample = false
    }

    if (inExample) {
      currentExample += line + '\n'
    } else if (!line.startsWith('@')) {
      description.push(line)
    }
  }

  if (currentExample) examples.push(currentExample.trim())

  return {
    description: description.join('\n').trim(),
    examples,
  }
}

/**
 * Scan directory for files.
 */
function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = []

  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath, extensions))
      } else if (extensions.some((ext) => entry.endsWith(ext))) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return files
}

/**
 * Escape HTML-like tags in description text to prevent Vue parsing issues.
 * Converts <tag> to `<tag>` but leaves code blocks intact.
 */
function escapeHtmlTags(text: string): string {
  // Match HTML-like tags that aren't already in backticks
  return text.replace(/<([a-zA-Z][a-zA-Z0-9-]*)>/g, '`<$1>`')
}

/**
 * Convert PascalCase to kebab-case.
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Get Storybook story ID from component name.
 */
function getStorybookId(name: string): string {
  return `example-${name.toLowerCase()}--default`
}

/**
 * Generate markdown for a component.
 */
function generateComponentMarkdown(doc: DocEntry): string {
  const storybookId = getStorybookId(doc.name)
  const safeDescription = escapeHtmlTags(doc.description)

  let md = `# ${doc.name}

${safeDescription}

## Import

\`\`\`typescript
import { ${doc.name} } from 'vuiii'
\`\`\`

`

  if (doc.examples.length > 0) {
    md += `## Basic Usage

<script setup>
import { ref } from 'vue'
import { ${doc.name} } from '../../src'
</script>

<ComponentDemo storybook="${storybookId}">
  <!-- Add live demo here -->
</ComponentDemo>

\`\`\`vue
${doc.examples[0]}
\`\`\`

`

    if (doc.examples.length > 1) {
      md += `## More Examples

`
      for (let i = 1; i < Math.min(doc.examples.length, 4); i++) {
        md += `\`\`\`vue
${doc.examples[i]}
\`\`\`

`
      }
    }
  }

  md += `::: tip Storybook
For interactive examples with all variants, see [${doc.name} in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/example-${doc.name.toLowerCase()}--docs).
:::
`

  return md
}

/**
 * Generate markdown for a composable.
 */
function generateComposableMarkdown(doc: DocEntry): string {
  const safeDescription = escapeHtmlTags(doc.description)

  let md = `# ${doc.name}

${safeDescription}

## Import

\`\`\`typescript
import { ${doc.name} } from 'vuiii'
\`\`\`

`

  if (doc.examples.length > 0) {
    md += `## Usage

\`\`\`typescript
${doc.examples[0]}
\`\`\`

`

    if (doc.examples.length > 1) {
      md += `## More Examples

`
      for (let i = 1; i < Math.min(doc.examples.length, 3); i++) {
        md += `\`\`\`typescript
${doc.examples[i]}
\`\`\`

`
      }
    }
  }

  return md
}

/**
 * Main documentation generator.
 */
function generateDocs() {
  const docs: DocEntry[] = []

  // Scan Vue components
  const componentFiles = scanDirectory(join(SRC_DIR, 'components'), ['.vue'])
  for (const file of componentFiles) {
    const content = readFileSync(file, 'utf-8')
    const jsdoc = extractVueJSDoc(content)
    if (jsdoc) {
      const { description, examples } = parseJSDoc(jsdoc)
      docs.push({
        name: basename(file, '.vue'),
        type: 'component',
        description,
        examples,
        file: file.replace(SRC_DIR, 'src'),
      })
    }
  }

  // Scan composables
  const composableFiles = scanDirectory(join(SRC_DIR, 'composables'), ['.ts'])
  for (const file of composableFiles) {
    const content = readFileSync(file, 'utf-8')
    const jsdoc = extractJSDoc(content)
    if (jsdoc) {
      const { description, examples } = parseJSDoc(jsdoc)
      docs.push({
        name: basename(file, '.ts'),
        type: 'composable',
        description,
        examples,
        file: file.replace(SRC_DIR, 'src'),
      })
    }
  }

  // Scan root-level composables
  const rootComposables = ['dialogStack.ts', 'snackbar.ts']
  for (const filename of rootComposables) {
    const file = join(SRC_DIR, filename)
    try {
      const content = readFileSync(file, 'utf-8')
      const jsdoc = extractJSDoc(content)
      if (jsdoc) {
        const { description, examples } = parseJSDoc(jsdoc)
        docs.push({
          name: basename(filename, '.ts'),
          type: 'composable',
          description,
          examples,
          file: `src/${filename}`,
        })
      }
    } catch {
      // File doesn't exist
    }
  }

  // Ensure output directories exist
  const componentsDir = join(DOCS_DIR, 'components')
  const composablesDir = join(DOCS_DIR, 'composables')

  if (!existsSync(componentsDir)) mkdirSync(componentsDir, { recursive: true })
  if (!existsSync(composablesDir)) mkdirSync(composablesDir, { recursive: true })

  // Generate component docs
  const components = docs.filter((d) => d.type === 'component')
  for (const doc of components) {
    const kebabName = toKebabCase(doc.name)
    const outputPath = join(componentsDir, `${kebabName}.md`)
    const content = generateComponentMarkdown(doc)
    writeFileSync(outputPath, content)
    console.log(`Generated: docs/components/${kebabName}.md`)
  }

  // Generate composable docs
  const composables = docs.filter((d) => d.type === 'composable')
  for (const doc of composables) {
    const kebabName = toKebabCase(doc.name)
    const outputPath = join(composablesDir, `${kebabName}.md`)
    const content = generateComposableMarkdown(doc)
    writeFileSync(outputPath, content)
    console.log(`Generated: docs/composables/${kebabName}.md`)
  }

  console.log('\n--- Summary ---')
  console.log(`Components: ${components.length}`)
  console.log(`Composables: ${composables.length}`)
}

generateDocs()
