import { matchesAccept } from './matchesAccept'

export function resolveFilesFromClipboardEvent(
  event: ClipboardEvent,
  options: { multiple?: boolean; accept?: 'image' | 'audio' } = {},
): File[] {
  let files: File[] = Array.from(event.clipboardData?.items || [])
    .filter((item) => item.kind === 'file')
    .map((item) => item.getAsFile())
    .filter((file) => file !== null)

  if (options.accept) {
    // Goes through the shared matcher, so the library has one definition of "matches accept".
    files = files.filter((file) => matchesAccept(file, [`${options.accept}/*`]))
  }

  if (!options.multiple) {
    files = files.slice(0, 1)
  }

  return files
}
