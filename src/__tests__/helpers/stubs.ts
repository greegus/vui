/**
 * Stubs for the boundaries jsdom or the test environment does not provide.
 *
 * These manipulate global state (a DOM prototype, the module-level icon resolver), which is exactly
 * the kind of thing worth having one copy of.
 */
import { vi } from 'vitest'
import { defineComponent } from 'vue'

/**
 * Stand-in for vue-router's RouterLink. Serialises a route-location object into the href so a test
 * can assert on what the component passed.
 */
export const RouterLinkStub = defineComponent({
  props: ['to', 'target'],
  template: `<a :href="typeof to === 'string' ? to : JSON.stringify(to)" :target="target"><slot /></a>`,
})

/** Marker stub for Icon, for use as `stubs: { Icon: IconStub }`. */
export const IconStub = defineComponent({
  props: ['name', 'size'],
  template: '<i class="icon-stub" :data-name="name" :data-size="size" />',
})

/**
 * jsdom does not implement scrollIntoView, which the cursor watchers call. Returns the spy, so a
 * test can assert which element was scrolled to; `vi.restoreAllMocks()` undoes it.
 */
export function stubScrollIntoView() {
  // jsdom does not define the property at all, and `vi.spyOn` requires an existing one.
  if (!('scrollIntoView' in Element.prototype)) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      value: () => {},
      writable: true,
      configurable: true,
    })
  }

  return vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {})
}
