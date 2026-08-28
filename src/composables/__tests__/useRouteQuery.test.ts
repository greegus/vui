import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { mountWithRouter as withRouteQuery } from '@/__tests__/helpers/router'
import { useRouteQuery } from '@/composables/useRouteQuery'

describe('useRouteQuery', () => {
  it('exposes the current query string parameters', async () => {
    const { result } = await withRouteQuery(() => useRouteQuery({}), { search: 'hello', category: 'books' })

    expect(result.queryParams.value).toEqual({ search: 'hello', category: 'books' })
  })

  it('keeps only the filtered parameters', async () => {
    const { result } = await withRouteQuery(() => useRouteQuery({ filter: ['search'] }), {
      search: 'hello',
      category: 'books',
    })

    expect(result.queryParams.value).toEqual({ search: 'hello' })
  })

  it('falls back to the defaults for parameters missing from the query', async () => {
    const { result } = await withRouteQuery(() => useRouteQuery({ defaults: { category: 'all' } }), { search: 'hello' })

    expect(result.queryParams.value).toEqual({ search: 'hello', category: 'all' })
  })

  it('prefers the query value over the default', async () => {
    const { result } = await withRouteQuery(() => useRouteQuery({ defaults: { category: 'all' } }), {
      category: 'books',
    })

    expect(result.queryParams.value.category).toBe('books')
  })

  it('applies the parse function to the raw query value', async () => {
    const { result } = await withRouteQuery(
      () => useRouteQuery<{ search: string }>({ parse: { search: (value) => value.toUpperCase() } }),
      { search: 'hello' },
    )

    expect(result.queryParams.value.search).toBe('HELLO')
  })

  it('reflects query changes made through the router', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({}), { search: 'hello' })

    await router.push({ path: '/', query: { search: 'world' } })

    expect(result.queryParams.value.search).toBe('world')
  })

  it('writes a single parameter to the query string, keeping the other ones', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({}), { category: 'books' })

    result.setQueryParam('search', 'hello')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ category: 'books', search: 'hello' })
    expect(result.queryParams.value.search).toBe('hello')
  })

  it('removes a parameter from the query string when its value is empty', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({}), { search: 'hello', category: 'books' })

    result.setQueryParam('search', '')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ category: 'books' })
  })

  it('replaces the whole query string on setQuery', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({}), { search: 'hello', category: 'books' })

    result.setQuery({ page: '2' })
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ page: '2' })
  })

  it('skips empty values on setQuery', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({}))

    result.setQuery({ search: 'hello', category: '', tags: [] as any, sort: undefined })
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ search: 'hello' })
  })

  it('applies the serialize function when writing a parameter', async () => {
    const { result, router } = await withRouteQuery(() =>
      useRouteQuery<{ tags: string[] }>({ serialize: { tags: (value) => (value as string[]).join('-') } }),
    )

    result.setQueryParam('tags', ['a', 'b'])
    await flushPromises()

    expect(router.currentRoute.value.query.tags).toBe('a-b')
  })

  it('round-trips a value containing special characters', async () => {
    const { result } = await withRouteQuery(() => useRouteQuery<{ search: string }>({}))

    result.setQueryParam('search', 'a & b')
    await flushPromises()

    expect(result.queryParams.value.search).toBe('a & b')
  })

  it('calls onChange when the query changes', async () => {
    const onChange = vi.fn()
    const { result } = await withRouteQuery(() => useRouteQuery({ onChange }), { search: 'hello' })

    expect(onChange).not.toHaveBeenCalled()

    result.setQueryParam('search', 'world')
    await flushPromises()

    expect(onChange).toHaveBeenCalledWith({ search: 'world' })
  })

  it('calls onChange right away when immediate is set', async () => {
    const onChange = vi.fn()
    await withRouteQuery(() => useRouteQuery({ onChange, immediate: true }), { search: 'hello' })

    expect(onChange).toHaveBeenCalledWith({ search: 'hello' })
  })

  it('does not call onChange for query changes outside of the filter', async () => {
    const onChange = vi.fn()
    const { result } = await withRouteQuery(() => useRouteQuery({ onChange, filter: ['search'] }), { search: 'hello' })

    result.setQueryParam('category', 'books')
    await flushPromises()

    expect(onChange).not.toHaveBeenCalled()
  })

  it('uses router.replace instead of router.push when the replace option is set', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({ replace: true }), { search: 'hello' })
    const pushSpy = vi.spyOn(router, 'push')
    const replaceSpy = vi.spyOn(router, 'replace')

    result.setQueryParam('search', 'world')
    await flushPromises()

    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('uses router.replace on setQuery when the replace option is set', async () => {
    const { result, router } = await withRouteQuery(() => useRouteQuery({ replace: true }), { search: 'hello' })
    const pushSpy = vi.spyOn(router, 'push')
    const replaceSpy = vi.spyOn(router, 'replace')

    result.setQuery({ category: 'books' })
    await flushPromises()

    expect(replaceSpy).toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })
})
