import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Shortcut } from '@/types'

const MAC_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
const WINDOWS_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'

// The component reads the platform once when its module is evaluated, so the user agent
// has to be stubbed before a fresh import of the module.
async function mountOn(userAgent: string, shortcut: Shortcut) {
  vi.stubGlobal('navigator', { userAgent })
  vi.resetModules()

  const ShortcutIcon = (await import('@/components/ShortcutIcon.vue')).default

  return mount(ShortcutIcon, { props: { shortcut } })
}

function keyLabels(wrapper: Awaited<ReturnType<typeof mountOn>>) {
  return wrapper.findAll('kbd').map((key) => key.text())
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ShortcutIcon', () => {
  it('renders a keycap for the plain key', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, { key: 'k' })

    expect(keyLabels(wrapper)).toEqual(['K'])
  })

  it('uppercases a single-character key', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, { key: 'a' })

    expect(keyLabels(wrapper)).toEqual(['A'])
  })

  it('leaves a multi-character key as-is', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, { key: 'Enter' })

    expect(keyLabels(wrapper)).toEqual(['Enter'])
  })

  it('renders the mod modifier as the command symbol on macOS', async () => {
    const wrapper = await mountOn(MAC_USER_AGENT, { key: 'k', mod: true })

    expect(keyLabels(wrapper)).toEqual(['⌘', 'K'])
  })

  it('renders the mod modifier as Ctrl on Windows', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, { key: 'k', mod: true })

    expect(keyLabels(wrapper)).toEqual(['Ctrl', 'K'])
  })

  it('renders alt as the option symbol on macOS and as Alt on Windows', async () => {
    const mac = await mountOn(MAC_USER_AGENT, { key: 'p', alt: true })
    const windows = await mountOn(WINDOWS_USER_AGENT, { key: 'p', alt: true })

    expect(keyLabels(mac)).toEqual(['⌥', 'P'])
    expect(keyLabels(windows)).toEqual(['Alt', 'P'])
  })

  it('renders shift as the shift symbol on macOS and as Shift on Windows', async () => {
    const mac = await mountOn(MAC_USER_AGENT, { key: 's', shift: true })
    const windows = await mountOn(WINDOWS_USER_AGENT, {
      key: 's',
      shift: true,
    })

    expect(keyLabels(mac)).toEqual(['⇧', 'S'])
    expect(keyLabels(windows)).toEqual(['Shift', 'S'])
  })

  it('renders ctrl as the control symbol on macOS and as Ctrl on Windows', async () => {
    const mac = await mountOn(MAC_USER_AGENT, { key: 'c', ctrl: true })
    const windows = await mountOn(WINDOWS_USER_AGENT, { key: 'c', ctrl: true })

    expect(keyLabels(mac)).toEqual(['⌃', 'C'])
    expect(keyLabels(windows)).toEqual(['Ctrl', 'C'])
  })

  it('orders multiple modifiers as ctrl, alt, shift, mod before the key on macOS', async () => {
    const wrapper = await mountOn(MAC_USER_AGENT, {
      key: 's',
      mod: true,
      shift: true,
      alt: true,
      ctrl: true,
    })

    expect(keyLabels(wrapper)).toEqual(['⌃', '⌥', '⇧', '⌘', 'S'])
  })

  it('orders multiple modifiers the same way on Windows', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, {
      key: 's',
      mod: true,
      shift: true,
    })

    expect(keyLabels(wrapper)).toEqual(['Shift', 'Ctrl', 'S'])
  })

  it('treats an iPad user agent as macOS', async () => {
    const wrapper = await mountOn('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', { key: 'k', mod: true })

    expect(keyLabels(wrapper)).toEqual(['⌘', 'K'])
  })

  it('re-renders the keycaps when the shortcut changes', async () => {
    const wrapper = await mountOn(WINDOWS_USER_AGENT, { key: 'k', mod: true })

    await wrapper.setProps({ shortcut: { key: 'j' } })

    expect(keyLabels(wrapper)).toEqual(['J'])
  })
})
