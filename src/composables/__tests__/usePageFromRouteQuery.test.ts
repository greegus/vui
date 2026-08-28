import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { mountWithRouter } from '@/__tests__/helpers/router'
import { usePageFromRouteQuery } from '@/composables/usePageFromRouteQuery'

const withPageFromRouteQuery = (
  options: Parameters<typeof usePageFromRouteQuery>[0] = {},
  initialQuery: Record<string, string> = {},
) => mountWithRouter(() => usePageFromRouteQuery(options), initialQuery)

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

  it('exposes the page from the query string as a number', async () => {
    const { result } = await withPageFromRouteQuery({}, { page: '2' })

    expect(result.page.value).toBe(2)
  })

  it('falls back to the first page when the query string has no page', async () => {
    const { result } = await withPageFromRouteQuery()

    expect(result.page.value).toBe(1)
  })

  it('keeps unrelated query parameters when setting the page', async () => {
    const { result, router } = await withPageFromRouteQuery({}, { search: 'hello' })

    result.setPage(2)
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ search: 'hello', page: '2' })
  })

  it('uses router.push by default, so paging stays in the browser history', async () => {
    const { result, router } = await withPageFromRouteQuery({}, { page: '1' })
    const pushSpy = vi.spyOn(router, 'push')
    const replaceSpy = vi.spyOn(router, 'replace')

    result.setPage(2)
    await flushPromises()

    expect(pushSpy).toHaveBeenCalledWith({ query: { page: '2' } })
    expect(replaceSpy).not.toHaveBeenCalled()
  })

  it('uses router.replace on setPage when the replace option is set', async () => {
    const { result, router } = await withPageFromRouteQuery({ replace: true }, { page: '1' })
    const pushSpy = vi.spyOn(router, 'push')
    const replaceSpy = vi.spyOn(router, 'replace')

    result.setPage(2)
    await flushPromises()

    expect(replaceSpy).toHaveBeenCalledWith({ query: { page: '2' } })
    expect(pushSpy).not.toHaveBeenCalled()
    expect(router.currentRoute.value.query).toEqual({ page: '2' })
  })
})
