export function resolveFilesFromClipboardEvent(
  event: ClipboardEvent,
  options: { multiple?: boolean; accept?: 'image' | 'audio' } = {}
): File[] {
  let files: File[] = Array.from(event.clipboardData?.items || [])
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file) => file !== null)

  if (options.accept) {
    files = files.filter((file) => {
      return file.type.startsWith(options.accept + '/')
    })
  }

  if (!options.multiple) {
    files = files.slice(0, 1)
  }

  return files
}
