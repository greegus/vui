export function resolveGlobImport(imports: { [path: string]: any }, filename: string): string {
  return Object.entries(imports)
    .map(([path, source]: [string, any]) => ({ path, source }))
    .find((item) => item.path.endsWith(`/${filename}`))?.source.default
}
