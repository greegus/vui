/**
 * Harness for the "did something happen outside this element?" composables. They share one
 * contract — subscribe on mount, fire for events outside the element, stop on unmount — so they
 * share one host component and one outside element.
 */
import { mount } from '@vue/test-utils'
import { type Ref, defineComponent, ref } from 'vue'

type Subscribe = (element: Ref<HTMLElement | undefined>, callback: (event: any) => void) => void

/**
 * Builds a host rendering `#box` (the watched element) with a `#inside` button, and mounts it
 * attached to the document so real events propagate. `rendered: false` mounts without the element.
 */
export function createOutsideHost(subscribe: Subscribe) {
  const Host = defineComponent({
    props: {
      callback: { type: Function, required: true },
      rendered: { type: Boolean, default: true },
    },
    setup(props) {
      const element = ref<HTMLElement>()

      subscribe(element, (event) => props.callback(event))

      return { element }
    },
    template: `
      <div v-if="rendered" ref="element" id="box">
        <button id="inside">Inside</button>
      </div>
    `,
  })

  return (callback: (event: any) => void, props: Record<string, unknown> = {}) =>
    mount(Host, { props: { callback, ...props }, attachTo: document.body })
}

/**
 * Appends a button outside the host and hands back a cleanup, so a test does not leak it into the
 * next one.
 */
export function appendOutsideElement(): { element: HTMLButtonElement; remove: () => void } {
  const element = document.createElement('button')
  document.body.appendChild(element)

  return { element, remove: () => element.remove() }
}
