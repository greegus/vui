import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

// The resolver and its component cache are module-level singletons, so every test starts
// from a freshly imported module graph.
async function loadIconModule() {
  vi.resetModules()

  const Icon = (await import('@/components/Icon.vue')).default
  const { registerCustomIconResolver } = await import('@/utils/iconsResolver')

  return { Icon, registerCustomIconResolver }
}

const CustomIcon = { template: '<svg class="custom-icon" />' }

// Built-in icons are async components whose loader dynamically imports the raw SVG,
// so the rendered output only appears a few macrotasks after mounting.
async function flushAsyncIcon(wrapper: { find: (selector: string) => { exists: () => boolean } }) {
  for (let attempt = 0; attempt < 20 && !wrapper.find('svg').exists(); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 5))
    await flushPromises()
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Icon', () => {
  it('renders the component returned by the registered custom resolver', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    registerCustomIconResolver(() => CustomIcon)

    const wrapper = mount(Icon, { props: { name: 'anything' } })

    expect(wrapper.find('svg.custom-icon').exists()).toBe(true)
    expect(wrapper.classes()).toContain('Icon')
  })

  it('passes the icon name to the custom resolver', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    const resolver = vi.fn(() => CustomIcon)
    registerCustomIconResolver(resolver)

    mount(Icon, { props: { name: 'user-plus' } })

    expect(resolver).toHaveBeenCalledWith('user-plus')
  })

  it('adds no size modifier class by default', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    registerCustomIconResolver(() => CustomIcon)

    const wrapper = mount(Icon, { props: { name: 'star' } })

    expect(wrapper.classes()).toContain('Icon')
    expect(wrapper.classes().some((className) => className.startsWith('Icon--'))).toBe(false)
  })

  it('applies the size modifier class', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    registerCustomIconResolver(() => CustomIcon)

    const wrapper = mount(Icon, { props: { name: 'star', size: 'large' } })

    expect(wrapper.classes()).toContain('Icon--large')
  })

  it('resolves the new icon when the name prop changes', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    registerCustomIconResolver((name) => ({
      template: `<svg class="icon-${name}" />`,
    }))

    const wrapper = mount(Icon, { props: { name: 'first' } })
    await wrapper.setProps({ name: 'second' })

    expect(wrapper.find('svg.icon-second').exists()).toBe(true)
    expect(wrapper.find('svg.icon-first').exists()).toBe(false)
  })

  it('resolves each icon name only once', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    const resolver = vi.fn(() => CustomIcon)
    registerCustomIconResolver(resolver)

    mount(Icon, { props: { name: 'repeated' } })
    mount(Icon, { props: { name: 'repeated' } })

    expect(resolver).toHaveBeenCalledTimes(1)
  })

  it('falls back to the built-in icon set when the custom resolver returns nothing', async () => {
    const { Icon, registerCustomIconResolver } = await loadIconModule()
    registerCustomIconResolver(() => undefined)

    const wrapper = mount(Icon, { props: { name: 'check' } })
    await flushAsyncIcon(wrapper)

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders a built-in icon when no custom resolver is registered', async () => {
    const { Icon } = await loadIconModule()

    const wrapper = mount(Icon, { props: { name: 'chevron-right' } })
    await flushAsyncIcon(wrapper)

    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('warns in development when the icon name cannot be resolved', async () => {
    const { Icon } = await loadIconModule()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    mount(Icon, { props: { name: 'definitely-not-an-icon' } })

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('definitely-not-an-icon'))
  })

  it('renders nothing when the icon name cannot be resolved', async () => {
    const { Icon } = await loadIconModule()
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const wrapper = mount(Icon, { props: { name: 'definitely-not-an-icon' } })

    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
