import { onBeforeUnmount, onMounted } from 'vue'

export function useOnKeyPress(
  key: KeyboardEvent['code'],
  callback: (event: KeyboardEvent) => boolean | void,
  options?: AddEventListenerOptions
) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === key.toLowerCase()) {
      callback(event)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress, options)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyPress, options)
  })
}
