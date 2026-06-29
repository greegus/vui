import { onBeforeUnmount, onMounted, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Traps keyboard focus within an element (e.g. a modal dialog) and restores
 * focus to the previously focused element when the trap is torn down.
 *
 * @param element - Ref to the container element that should trap focus
 * @param options.initialFocus - Optional resolver for the element to focus on mount.
 *   Defaults to the first focusable descendant, falling back to the container itself.
 *
 * @example
 * const root = ref<HTMLElement>()
 * useFocusTrap(root)
 */
export function useFocusTrap(
  element: Ref<HTMLElement | undefined>,
  options: { initialFocus?: () => HTMLElement | null | undefined } = {},
): void {
  const previouslyFocused = (typeof document !== 'undefined' ? document.activeElement : null) as HTMLElement | null

  function getFocusableElements(): HTMLElement[] {
    if (!element.value) {
      return []
    }

    return Array.from(element.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    )
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !element.value) {
      return
    }

    const focusable = getFocusableElements()

    if (!focusable.length) {
      event.preventDefault()
      element.value.focus()
      return
    }

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const active = document.activeElement

    if (event.shiftKey) {
      if (active === first || !element.value.contains(active)) {
        event.preventDefault()
        last.focus()
      }
    } else if (active === last || !element.value.contains(active)) {
      event.preventDefault()
      first.focus()
    }
  }

  onMounted(() => {
    element.value?.addEventListener('keydown', handleKeydown)

    const target = options.initialFocus?.() ?? getFocusableElements()[0] ?? element.value
    target?.focus()
  })

  onBeforeUnmount(() => {
    element.value?.removeEventListener('keydown', handleKeydown)
    previouslyFocused?.focus?.()
  })
}
