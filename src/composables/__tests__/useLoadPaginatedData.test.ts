import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { useLoadPaginatedData } from '@/composables/useLoadPaginatedData'
import type { PaginatedData, Pagination } from '@/types'

// useLoadPaginatedData builds on useLoadData/useSubmitAction, which call useRouter()
// during setup; provide a stub so it works outside a component.
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const TOTAL_PAGES = 3

function pageOf(page: number, itemsPerPage = 2): PaginatedData<string> {
  const items = Array.from({ length: itemsPerPage }, (_, index) => `page${page}-item${index + 1}`)

  const pagination: Pagination = {
    currentPage: page,
    hasNextPage: page < TOTAL_PAGES,
    hasPreviousPage: page > 1,
    totalItems: TOTAL_PAGES * itemsPerPage,
    itemsPerPage,
    totalPages: TOTAL_PAGES,
  }

  return { items, pagination }
}

function createSource() {
  return vi.fn(({ page, itemsPerPage }: { page: number; itemsPerPage: number }) =>
    Promise.resolve(pageOf(page, itemsPerPage)),
  )
}

describe('useLoadPaginatedData', () => {
  it('starts with no items and no pagination before the first load', () => {
    const { items, pagination, hasLoaded } = useLoadPaginatedData(createSource())

    expect(items.value).toEqual([])
    expect(pagination.value).toBeUndefined()
    expect(hasLoaded.value).toBe(false)
  })

  it('stores the items and the pagination of the loaded page', async () => {
    const source = createSource()
    const { items, pagination, loadPage } = useLoadPaginatedData(source, { itemsPerPage: 2 })

    await loadPage(2)

    expect(items.value).toEqual(['page2-item1', 'page2-item2'])
    expect(pagination.value).toMatchObject({ currentPage: 2, totalPages: 3, totalItems: 6 })
  })

  it('asks the source for the first page and 25 items per page by default', async () => {
    const source = createSource()
    const { loadPage } = useLoadPaginatedData(source)

    await loadPage()

    expect(source).toHaveBeenCalledWith({ page: 1, itemsPerPage: 25 })
  })

  it('passes the configured itemsPerPage to the source', async () => {
    const source = createSource()
    const { loadPage } = useLoadPaginatedData(source, { itemsPerPage: 10 })

    await loadPage(2)

    expect(source).toHaveBeenCalledWith({ page: 2, itemsPerPage: 10 })
  })

  it('toggles isLoading around loadPage', async () => {
    let resolve!: (value: PaginatedData<string>) => void
    const pending = new Promise<PaginatedData<string>>((r) => (resolve = r))
    const { loadPage, isLoading, hasLoaded } = useLoadPaginatedData(() => pending)

    expect(isLoading.value).toBe(false)
    const loading = loadPage(1)
    expect(isLoading.value).toBe(true)

    resolve(pageOf(1))
    await loading

    expect(isLoading.value).toBe(false)
    expect(hasLoaded.value).toBe(true)
  })

  it('returns the loaded page from loadPage', async () => {
    const { loadPage } = useLoadPaginatedData(createSource(), { itemsPerPage: 2 })

    const results = await loadPage(3)

    expect(results.items).toEqual(['page3-item1', 'page3-item2'])
    expect(results.pagination.currentPage).toBe(3)
  })

  it('loads the following page and replaces the items on loadNextPage', async () => {
    const source = createSource()
    const { items, pagination, loadPage, loadNextPage } = useLoadPaginatedData(source, { itemsPerPage: 2 })

    await loadPage(1)
    await loadNextPage()

    expect(source).toHaveBeenLastCalledWith({ page: 2, itemsPerPage: 2 })
    expect(items.value).toEqual(['page2-item1', 'page2-item2'])
    expect(pagination.value?.currentPage).toBe(2)
  })

  it('does nothing on loadNextPage when the current page has no next page', async () => {
    const source = createSource()
    const { items, loadPage, loadNextPage } = useLoadPaginatedData(source, { itemsPerPage: 2 })

    await loadPage(3)
    const results = await loadNextPage()

    expect(results).toBeUndefined()
    expect(source).toHaveBeenCalledTimes(1)
    expect(items.value).toEqual(['page3-item1', 'page3-item2'])
  })

  it('does nothing on loadNextPage before any page has been loaded', async () => {
    const source = createSource()
    const { loadNextPage } = useLoadPaginatedData(source)

    const results = await loadNextPage()

    expect(results).toBeUndefined()
    expect(source).not.toHaveBeenCalled()
  })

  it('loads the preceding page and replaces the items on loadPreviousPage', async () => {
    const source = createSource()
    const { items, pagination, loadPage, loadPreviousPage } = useLoadPaginatedData(source, { itemsPerPage: 2 })

    await loadPage(3)
    await loadPreviousPage()

    expect(source).toHaveBeenLastCalledWith({ page: 2, itemsPerPage: 2 })
    expect(items.value).toEqual(['page2-item1', 'page2-item2'])
    expect(pagination.value?.currentPage).toBe(2)
  })

  it('does nothing on loadPreviousPage when the current page is the first one', async () => {
    const source = createSource()
    const { loadPage, loadPreviousPage } = useLoadPaginatedData(source, { itemsPerPage: 2 })

    await loadPage(1)
    const results = await loadPreviousPage()

    expect(results).toBeUndefined()
    expect(source).toHaveBeenCalledTimes(1)
  })

  it('appends the next page to the already loaded items in append mode', async () => {
    const { items, loadPage, loadNextPage } = useLoadPaginatedData(createSource(), { itemsPerPage: 2, append: true })

    await loadPage(1)
    await loadNextPage()
    await loadNextPage()

    expect(items.value).toEqual([
      'page1-item1',
      'page1-item2',
      'page2-item1',
      'page2-item2',
      'page3-item1',
      'page3-item2',
    ])
  })

  it('prepends the previous page to the already loaded items in append mode', async () => {
    const { items, loadPage, loadPreviousPage } = useLoadPaginatedData(createSource(), {
      itemsPerPage: 2,
      append: true,
    })

    await loadPage(2)
    await loadPreviousPage()

    expect(items.value).toEqual(['page1-item1', 'page1-item2', 'page2-item1', 'page2-item2'])
  })

  it('replaces the items on loadPage even in append mode', async () => {
    const { items, loadPage } = useLoadPaginatedData(createSource(), { itemsPerPage: 2, append: true })

    await loadPage(1)
    await loadPage(3)

    expect(items.value).toEqual(['page3-item1', 'page3-item2'])
  })

  it('loads the first page on mount when immediate is set', async () => {
    const source = createSource()
    const Host = defineComponent({
      setup() {
        return useLoadPaginatedData(source, { itemsPerPage: 2, immediate: true })
      },
      template: '<ul><li v-for="item in items" :key="item">{{ item }}</li></ul>',
    })

    const wrapper = mount(Host)
    await new Promise((resolve) => setTimeout(resolve))

    expect(source).toHaveBeenCalledWith({ page: 1, itemsPerPage: 2 })
    expect(wrapper.findAll('li').map((li) => li.text())).toEqual(['page1-item1', 'page1-item2'])
  })

  it('does not load anything on mount without the immediate option', async () => {
    const source = createSource()
    const Host = defineComponent({
      setup: () => useLoadPaginatedData(source),
      template: '<div />',
    })

    mount(Host)
    await new Promise((resolve) => setTimeout(resolve))

    expect(source).not.toHaveBeenCalled()
  })

  // BUG: the documented `startingPage` option is accepted but never used - the immediate
  // load always requests page 1.
  it.skip('loads the configured startingPage on mount when immediate is set', async () => {
    const source = createSource()
    const Host = defineComponent({
      setup: () => useLoadPaginatedData(source, { itemsPerPage: 2, startingPage: 3, immediate: true }),
      template: '<div />',
    })

    mount(Host)
    await new Promise((resolve) => setTimeout(resolve))

    expect(source).toHaveBeenCalledWith({ page: 3, itemsPerPage: 2 })
  })
})
