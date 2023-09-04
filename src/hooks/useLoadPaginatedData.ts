import { type Ref, onMounted, ref } from 'vue'

import { useLoadData } from '@/hooks/useLoadData'
import type { PaginatedData, PaginatedDataSource, Pagination } from '@/types'

const DEFAULT_ITEMS_PER_PAGE = 25

export function useLoadPaginatedData<Item = unknown>(
  source: PaginatedDataSource<Item>,
  options: Parameters<typeof useLoadData>[1] & {
    startingPage?: number
    itemsPerPage?: number
    append?: boolean
  } = {}
): {
  items: Ref<Item[]>
  pagination: Ref<Pagination | undefined>
  isLoading: Ref<boolean>
  hasLoaded: Ref<boolean>
  loadPage: (page?: number) => Promise<PaginatedData<Item>>
  loadNextPage: () => Promise<PaginatedData<Item> | undefined>
  loadPreviousPage: () => Promise<PaginatedData<Item> | undefined>
} {
  const items = ref<Item[]>([]) as Ref<Item[]>

  const pagination = ref<Pagination>()

  const { immediate, initialValue: _initialValue, ...transferedOptions } = options

  const { isLoading, hasLoaded, load } = useLoadData(source, transferedOptions)

  const loadPage = async (page: number = 1): Promise<PaginatedData<Item>> => {
    const results = await load({ page, itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE })

    items.value = results.items
    pagination.value = results.pagination

    return results
  }

  const loadNextPage = async (): Promise<PaginatedData<Item> | undefined> => {
    if (!pagination.value?.hasNextPage) {
      return
    }

    const results = await load({
      page: pagination.value!.currentPage + 1,
      itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE
    })

    if (options.append) {
      items.value = [...items.value, ...results.items]
    } else {
      items.value = results.items
    }

    pagination.value = results.pagination

    return results
  }

  const loadPreviousPage = async (): Promise<PaginatedData<Item> | undefined> => {
    if (!pagination.value?.hasPreviousPage) {
      return
    }

    const results = await load({
      page: pagination.value!.currentPage - 1,
      itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE
    })

    if (options.append) {
      items.value = [...results.items, ...items.value]
    } else {
      items.value = results.items
    }

    pagination.value = results.pagination

    return results
  }

  if (immediate) {
    onMounted(loadPage)
  }

  return {
    isLoading,
    hasLoaded,
    items,
    pagination,
    loadPage,
    loadNextPage,
    loadPreviousPage
  }
}
