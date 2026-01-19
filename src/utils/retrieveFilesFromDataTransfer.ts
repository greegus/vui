import { loadURLAsFile } from '@/utils/loadURLAsFile'
import { retrieveMediaUrlFromHTML } from '@/utils/retrieveMediaUrlFromHTML'

export async function retrieveFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const files = Array.from(dataTransfer.files)

  if (files.length) {
    return files
  }

  const html = dataTransfer.getData('text/html')

  if (html) {
    const mediaUrl = retrieveMediaUrlFromHTML(html)

    if (mediaUrl) {
      const file = await loadURLAsFile(mediaUrl)
      return [file]
    }
  }

  return []
}
