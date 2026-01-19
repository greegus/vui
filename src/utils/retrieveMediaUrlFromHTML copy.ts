export function retrieveMediaUrlFromHTML(html: string): string | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const img = doc.querySelector('img, video, audio')
  return img?.getAttribute('src') || null
}
