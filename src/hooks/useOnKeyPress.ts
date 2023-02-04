import { onBeforeUnmount, onMounted } from 'vue'

export function useOnKeyPress(key: KeyboardEvent['code'], callback: (event: KeyboardEvent) => boolean | void) {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === key) {
      callback(event)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyPress)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyPress)
  })
}
