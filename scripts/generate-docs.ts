/**
 * Documentation generator for vuiii library.
 * Extracts JSDoc comments from Vue components, composables, and utilities
 * to generate a unified CLAUDE.md file for AI agent consumption.
 *
 * Run with: npx jiti scripts/generate-docs.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, basename, extname } from "path";

const SRC_DIR = join(import.meta.dirname, "../src");
const OUTPUT_FILE = join(import.meta.dirname, "../CLAUDE.md");

interface DocEntry {
  name: string;
  type: "component" | "composable" | "utility" | "type";
  jsdoc: string;
  file: string;
}

/**
 * Extract JSDoc comment from the beginning of a script section or file.
 */
function extractJSDoc(content: string): string {
  // Match JSDoc at the start of <script> or file
  const jsdocMatch = content.match(/\/\*\*[\s\S]*?\*\//);
  return jsdocMatch ? jsdocMatch[0] : "";
}

/**
 * Extract JSDoc from Vue SFC file.
 */
function extractVueJSDoc(content: string): string {
  // Look for JSDoc in <script lang="ts"> or <script lang="ts" setup> sections
  const scriptMatch = content.match(/<script[^>]*>[\s\S]*?<\/script>/g);
  if (!scriptMatch) return "";

  for (const script of scriptMatch) {
    const jsdoc = extractJSDoc(script);
    if (jsdoc && jsdoc.includes("@component")) {
      return jsdoc;
    }
    // Also check for module-level JSDoc
    if (jsdoc && jsdoc.includes("@example")) {
      return jsdoc;
    }
  }

  // Return first JSDoc found
  for (const script of scriptMatch) {
    const jsdoc = extractJSDoc(script);
    if (jsdoc) return jsdoc;
  }

  return "";
}

/**
 * Parse JSDoc into structured sections.
 */
function parseJSDoc(jsdoc: string): { description: string; examples: string[] } {
  const lines = jsdoc.replace(/^\/\*\*|\*\/$/g, "").split("\n");
  const description: string[] = [];
  const examples: string[] = [];
  let currentExample = "";
  let inExample = false;

  for (let line of lines) {
    line = line.replace(/^\s*\*\s?/, ""); // Remove leading * and space

    if (line.startsWith("@example")) {
      if (currentExample) examples.push(currentExample.trim());
      currentExample = "";
      inExample = true;
      continue;
    }

    if (line.startsWith("@") && inExample) {
      if (currentExample) examples.push(currentExample.trim());
      currentExample = "";
      inExample = false;
    }

    if (inExample) {
      currentExample += line + "\n";
    } else if (!line.startsWith("@")) {
      description.push(line);
    }
  }

  if (currentExample) examples.push(currentExample.trim());

  return {
    description: description.join("\n").trim(),
    examples,
  };
}

/**
 * Scan directory for files.
 */
function scanDirectory(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...scanDirectory(fullPath, extensions));
      } else if (extensions.some((ext) => entry.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }

  return files;
}

/**
 * Main documentation generator.
 */
function generateDocs() {
  const docs: DocEntry[] = [];

  // Scan Vue components
  const componentFiles = scanDirectory(join(SRC_DIR, "components"), [".vue"]);
  for (const file of componentFiles) {
    const content = readFileSync(file, "utf-8");
    const jsdoc = extractVueJSDoc(content);
    if (jsdoc) {
      docs.push({
        name: basename(file, ".vue"),
        type: "component",
        jsdoc,
        file: file.replace(SRC_DIR, "src"),
      });
    }
  }

  // Scan composables
  const composableFiles = scanDirectory(join(SRC_DIR, "composables"), [".ts"]);
  for (const file of composableFiles) {
    const content = readFileSync(file, "utf-8");
    const jsdoc = extractJSDoc(content);
    if (jsdoc) {
      docs.push({
        name: basename(file, ".ts"),
        type: "composable",
        jsdoc,
        file: file.replace(SRC_DIR, "src"),
      });
    }
  }

  // Scan utilities
  const utilFiles = scanDirectory(join(SRC_DIR, "utils"), [".ts"]);
  for (const file of utilFiles) {
    const content = readFileSync(file, "utf-8");
    const jsdoc = extractJSDoc(content);
    if (jsdoc) {
      docs.push({
        name: basename(file, ".ts"),
        type: "utility",
        jsdoc,
        file: file.replace(SRC_DIR, "src"),
      });
    }
  }

  // Scan root-level files
  const rootFiles = ["dialogStack.ts", "snackbar.ts", "types.ts"];
  for (const filename of rootFiles) {
    const file = join(SRC_DIR, filename);
    try {
      const content = readFileSync(file, "utf-8");
      const jsdoc = extractJSDoc(content);
      if (jsdoc) {
        docs.push({
          name: basename(filename, ".ts"),
          type: filename === "types.ts" ? "type" : "composable",
          jsdoc,
          file: `src/${filename}`,
        });
      }
    } catch {
      // File doesn't exist
    }
  }

  // Generate markdown
  let markdown = `# VUIII - Vue Component Library

> AI Agent Context File - Auto-generated from source code JSDoc comments.
> Run \`npm run docs\` to regenerate.

## Overview

VUIII is a Vue 3 component library with TypeScript support, providing a comprehensive set of UI components, composables, and utilities for building modern web applications.

## Installation

\`\`\`bash
npm install vuiii
\`\`\`

\`\`\`typescript
import { Button, Input, Select, FormFields } from 'vuiii'
import 'vuiii/style.css'
\`\`\`

## Components

`;

  // Group by type
  const components = docs.filter((d) => d.type === "component");
  const composables = docs.filter((d) => d.type === "composable");
  const utilities = docs.filter((d) => d.type === "utility");
  const types = docs.filter((d) => d.type === "type");

  // Components section
  for (const doc of components.sort((a, b) => a.name.localeCompare(b.name))) {
    const { description, examples } = parseJSDoc(doc.jsdoc);
    markdown += `### ${doc.name}\n\n`;
    markdown += `**File:** \`${doc.file}\`\n\n`;
    if (description) {
      markdown += `${description}\n\n`;
    }
    if (examples.length > 0) {
      markdown += `**Examples:**\n\n`;
      for (const example of examples.slice(0, 3)) {
        // Limit to 3 examples
        markdown += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
      }
    }
  }

  // Composables section
  markdown += `## Composables\n\n`;
  for (const doc of composables.sort((a, b) => a.name.localeCompare(b.name))) {
    const { description, examples } = parseJSDoc(doc.jsdoc);
    markdown += `### ${doc.name}\n\n`;
    markdown += `**File:** \`${doc.file}\`\n\n`;
    if (description) {
      markdown += `${description}\n\n`;
    }
    if (examples.length > 0) {
      markdown += `**Examples:**\n\n`;
      for (const example of examples.slice(0, 2)) {
        markdown += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
      }
    }
  }

  // Utilities section
  markdown += `## Utilities\n\n`;
  for (const doc of utilities.sort((a, b) => a.name.localeCompare(b.name))) {
    const { description, examples } = parseJSDoc(doc.jsdoc);
    markdown += `### ${doc.name}\n\n`;
    markdown += `**File:** \`${doc.file}\`\n\n`;
    if (description) {
      markdown += `${description}\n\n`;
    }
    if (examples.length > 0) {
      markdown += `**Examples:**\n\n`;
      for (const example of examples.slice(0, 2)) {
        markdown += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
      }
    }
  }

  // Types section
  if (types.length > 0) {
    markdown += `## Types\n\n`;
    for (const doc of types) {
      const { description, examples } = parseJSDoc(doc.jsdoc);
      markdown += `### ${doc.name}\n\n`;
      markdown += `**File:** \`${doc.file}\`\n\n`;
      if (description) {
        markdown += `${description}\n\n`;
      }
    }
  }

  // Write output
  writeFileSync(OUTPUT_FILE, markdown);
  console.log(`Documentation generated: ${OUTPUT_FILE}`);
  console.log(`  Components: ${components.length}`);
  console.log(`  Composables: ${composables.length}`);
  console.log(`  Utilities: ${utilities.length}`);
}

generateDocs();
