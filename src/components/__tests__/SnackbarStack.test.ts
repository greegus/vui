import { type VueWrapper, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import SnackbarStack from '@/components/snackbar/SnackbarStack.vue'
import { messages, useSnackbar } from '@/snackbar'

let wrapper: VueWrapper | undefined

function mountStack() {
  wrapper = mount(SnackbarStack, { global: { stubs: { Icon: true } } })
  return wrapper
}

function renderedMessages() {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.Snackbar__messageBlock'))
}

function renderedTexts() {
  return renderedMessages().map((element) => element.textContent?.trim())
}

describe('SnackbarStack', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    messages.value = []
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    vi.clearAllTimers()
    vi.useRealTimers()
    messages.value = []
    document.body.innerHTML = ''
  })

  it('teleports a polite live region to the document body', () => {
    mountStack()

    const liveRegion = document.body.querySelector('[role="status"]')
    expect(liveRegion).not.toBeNull()
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite')
  })

  it('renders no messages while the stack is empty', () => {
    mountStack()

    expect(renderedMessages()).toHaveLength(0)
  })

  it('renders a message that was already in the stack before mounting', () => {
    useSnackbar().success('Item saved!')

    mountStack()

    expect(renderedTexts()).toEqual(['Item saved!'])
  })

  it('renders a message shown after mounting', async () => {
    mountStack()

    useSnackbar().success('Item saved!')
    await nextTick()

    expect(renderedTexts()).toEqual(['Item saved!'])
  })

  it('renders the newest message first', async () => {
    mountStack()

    const snackbar = useSnackbar()
    snackbar.success('oldest')
    snackbar.success('newest')
    await nextTick()

    expect(renderedTexts()).toEqual(['newest', 'oldest'])
  })

  it('marks a success and an error message with their type modifier', async () => {
    mountStack()

    useSnackbar().error('Failed to save item')
    useSnackbar().success('Item saved!')
    await nextTick()

    const [success, error] = renderedMessages()
    expect(success!.classList).toContain('Snackbar__messageBlock--success')
    expect(error!.classList).toContain('Snackbar__messageBlock--error')
  })

  it('removes a message from the DOM when its close button is clicked', async () => {
    mountStack()

    const snackbar = useSnackbar()
    snackbar.success('keep me')
    snackbar.error('dismiss me')
    await nextTick()

    document.body.querySelector<HTMLButtonElement>('button[aria-label="Close"]')!.click()
    await nextTick()

    expect(renderedTexts()).toEqual(['keep me'])
    expect(messages.value.map(({ text }) => text)).toEqual(['keep me'])
  })

  it('removes a message from the DOM once its duration elapses', async () => {
    mountStack()

    useSnackbar().success('Quick message', 3_000)
    await nextTick()
    expect(renderedMessages()).toHaveLength(1)

    vi.advanceTimersByTime(3_000)
    await nextTick()

    expect(renderedMessages()).toHaveLength(0)
  })

  it('keeps a persistent message rendered after the default duration', async () => {
    mountStack()

    useSnackbar().error('Critical error - please refresh', 0)
    await nextTick()

    vi.advanceTimersByTime(60_000)
    await nextTick()

    expect(renderedTexts()).toEqual(['Critical error - please refresh'])
  })

  it('renders at most five messages', async () => {
    mountStack()

    const snackbar = useSnackbar()
    for (let i = 1; i <= 7; i++) {
      snackbar.success(`message ${i}`)
    }
    await nextTick()

    expect(renderedTexts()).toEqual(['message 7', 'message 6', 'message 5', 'message 4', 'message 3'])
  })

  it('gives every rendered message its own close button', async () => {
    mountStack()

    const snackbar = useSnackbar()
    snackbar.success('one')
    snackbar.error('two')
    await nextTick()

    expect(document.body.querySelectorAll('button[aria-label="Close"]')).toHaveLength(2)
  })
})
