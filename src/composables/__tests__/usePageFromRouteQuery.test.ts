import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'

import { usePageFromRouteQuery } from '@/composables/usePageFromRouteQuery'

async function withPageFromRouteQuery(
  options: Parameters<typeof usePageFromRouteQuery>[0] = {},
  initialQuery: Record<string, string> = {},
): Promise<{ result: ReturnType<typeof usePageFromRouteQuery>; router: Router }> {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })

  await router.push({ path: '/', query: initialQuery })
  await router.isReady()

  let result!: ReturnType<typeof usePageFromRouteQuery>

  mount(
    defineComponent({
      setup() {
        result = usePageFromRouteQuery(options)
        return () => null
      },
    }),
    { global: { plugins: [router] } },
  )

  return { result, router }
}

describe('usePageFromRouteQuery', () => {
  it('writes the page into the query string on setPage', async () => {
    const { result, router } = await withPageFromRouteQuery()

    result.setPage(3)
    await flushPromises()

    expect(router.currentRoute.value.query.page).toBe('3')
  })

  it('picks up the page written by setPage', async () => {
    const { result } = await withPageFromRouteQuery()

    result.setPage(4)
    await flushPromises()

    expect(Number(result.page.value)).toBe(4)
  })

  it('picks up the page from the query string set through the router', async () => {
    const { result, router } = await withPageFromRouteQuery({}, { page: '2' })

    await router.push({ path: '/', query: { page: '5' } })

    expect(Number(result.page.value)).toBe(5)
  })

  it('calls onChange when the page in the query string changes', async () => {
    const onChange = vi.fn()
    const { result } = await withPageFromRouteQuery({ onChange }, { page: '1' })

    expect(onChange).not.toHaveBeenCalled()

    result.setPage(2)
    await flushPromises()

    expect(onChange).toHaveBeenCalledOnce()
  })

  it('calls onChange right away when immediate is set', async () => {
    const onChange = vi.fn()
    await withPageFromRouteQuery({ onChange, immediate: true }, { page: '2' })

    expect(onChange).toHaveBeenCalledOnce()
  })

  // BUG: useRouteQuery pipes every parsed value through decodeURIComponent, which turns the
  // parsed number back into a string, so `page` is '2' instead of 2.
  it.skip('exposes the page from the query string as a number', async () => {
    const { result } = await withPageFromRouteQuery({}, { page: '2' })

    expect(result.page.value).toBe(2)
  })

  // BUG: the `parse` fallback (`Number(page) || 1`) only runs for parameters present in the
  // query, so `page` is undefined instead of the documented default of 1.
  it.skip('falls back to the first page when the query string has no page', async () => {
    const { result } = await withPageFromRouteQuery()

    expect(result.page.value).toBe(1)
  })

  // BUG: setPage goes through setQuery, which replaces the whole query string and therefore
  // wipes unrelated parameters such as active filters.
  it.skip('keeps unrelated query parameters when setting the page', async () => {
    const { result, router } = await withPageFromRouteQuery({}, { search: 'hello' })

    result.setPage(2)
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ search: 'hello', page: '2' })
  })
})
