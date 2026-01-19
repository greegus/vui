export async function loadURLAsFile(url: string): Promise<File> {
  const response = await fetch(
    `${import.meta.env.VITE_APP_PUBQUIZ_API_URL}/media/download-from-url?url=${encodeURIComponent(url)}`
  )
  const blob = await response.blob()

  return new File([blob], url.split('/').pop()!, { type: blob.type })
}
