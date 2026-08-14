/**
 * Matching for the `accept` filter, mirroring the three forms the HTML `accept` attribute
 * allows: an exact MIME type (`image/png`), a MIME wildcard such as `image/*`, and a
 * file extension (`.pdf`). A bare `*` and the catch-all wildcard accept anything.
 *
 * @module matchesAccept
 */

function matchesAcceptedType(file: File, accept: string): boolean {
  const type = accept.trim().toLowerCase()

  if (!type) {
    return false
  }

  if (type === '*/*' || type === '*') {
    return true
  }

  if (type.startsWith('.')) {
    return file.name.toLowerCase().endsWith(type)
  }

  if (type.endsWith('/*')) {
    return file.type.toLowerCase().startsWith(type.slice(0, -1))
  }

  return file.type.toLowerCase() === type
}

/**
 * Tests a file against a list of accepted types. An empty or missing list accepts everything.
 *
 * @param file - The file to test
 * @param accept - Accepted types, already split into individual entries
 * @returns True when the file matches at least one entry
 *
 * @example
 * matchesAccept(pngFile, ['image/*']) // true
 * matchesAccept(pdfFile, ['.pdf']) // true
 * matchesAccept(pngFile, ['application/pdf']) // false
 */
export function matchesAccept(file: File, accept: string[] | undefined): boolean {
  return !accept?.length || accept.some((type) => matchesAcceptedType(file, type))
}
