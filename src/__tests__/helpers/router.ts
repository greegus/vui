/**
 * Mounts a composable inside a component that has a real (memory-history) router, which is what the
 * routing composables need — a hand-rolled `useRoute`/`useRouter` mock would not exercise the
 * navigation they depend on.
 */
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'

export async function mountWithRouter<T>(
  composable: () => T,
  initialQuery: Record<string, string> = {},
): Promise<{ result: T; router: Router }> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })

  await router.push({ path: '/', query: initialQuery })
  await router.isReady()

  let result!: T

  mount(
    defineComponent({
      setup() {
        result = composable()

        return () => null
      },
    }),
    { global: { plugins: [router] } },
  )

  return { result, router }
}
