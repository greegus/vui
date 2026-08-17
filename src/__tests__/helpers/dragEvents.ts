/**
 * jsdom implements neither `DragEvent` nor `DataTransfer`, so this builds the shape `useDropArea`
 * and `retrieveFilesFromDataTransfer` actually read: `items` for the "is this droppable?" guard,
 * `files`, `dropEffect`, and `getData('text/html')` for an image dragged out of another page.
 *
 * Kept in one place because that read pattern is part of the contract under test — `items[].kind`
 * is only ever 'file' or 'string' per the DOM spec, with the MIME type in `type`.
 */
export type DataTransferItemShape = { kind: 'file' | 'string'; type: string }

export const FILE_ITEM: DataTransferItemShape = { kind: 'file', type: 'image/png' }
export const HTML_ITEM: DataTransferItemShape = { kind: 'string', type: 'text/html' }
export const PLAIN_TEXT_ITEM: DataTransferItemShape = { kind: 'string', type: 'text/plain' }

export function dragEvent(
  type: string,
  { files = [], items, html }: { files?: File[]; items?: DataTransferItemShape[]; html?: string } = {},
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true })

  const resolvedItems = items ?? [
    ...files.map((file) => ({ kind: 'file' as const, type: file.type })),
    ...(html ? [HTML_ITEM] : []),
  ]

  Object.defineProperty(event, 'dataTransfer', {
    value: {
      items: resolvedItems,
      files,
      dropEffect: 'none',
      getData: (format: string) => (format === 'text/html' ? (html ?? '') : ''),
    },
  })

  return event
}
