import { onMounted, type Ref, ref } from "vue";

import type { PaginatedData, PaginatedDataSource, Pagination } from "@/types";

import { useLoadData } from "@/composables/useLoadData";

const DEFAULT_ITEMS_PER_PAGE = 25;

/**
 * Extends useLoadData with pagination support for loading data in pages.
 * Provides methods for loading specific pages, next/previous navigation,
 * and optional append mode for infinite scroll.
 *
 * @template Item - The type of items in the paginated list
 * @param source - Function that fetches paginated data
 * @param options - Configuration options (inherits useLoadData options)
 * @param options.startingPage - Initial page to load (default: 1)
 * @param options.itemsPerPage - Items per page (default: 25)
 * @param options.append - Append new items instead of replacing
 * @param options.immediate - Load first page immediately on mount
 * @returns Object with items, pagination state, and navigation methods
 *
 * @example
 * // Basic paginated data loading
 * import { useLoadPaginatedData } from 'vuiii'
 * import type { PaginatedData } from 'vuiii'
 *
 * const { items, pagination, loadPage, isLoading } = useLoadPaginatedData(
 *   ({ page, itemsPerPage }) => api.getUsers({ page, itemsPerPage })
 * )
 *
 * onMounted(() => loadPage(1))
 *
 * @example
 * // With immediate loading
 * const { items, pagination } = useLoadPaginatedData(
 *   ({ page, itemsPerPage }) => api.getItems({ page, itemsPerPage }),
 *   { immediate: true }
 * )
 *
 * @example
 * // Navigation between pages
 * const { loadPage, loadNextPage, loadPreviousPage, pagination } = useLoadPaginatedData(source)
 *
 * await loadPage(1)  // Load first page
 * await loadNextPage()  // Go to page 2
 * await loadPreviousPage()  // Back to page 1
 * await loadPage(5)  // Jump to page 5
 *
 * @example
 * // Infinite scroll with append mode
 * const { items, loadNextPage, pagination } = useLoadPaginatedData(
 *   source,
 *   { append: true, immediate: true }
 * )
 *
 * // Each loadNextPage() appends to existing items
 * function onScrollEnd() {
 *   if (pagination.value?.hasNextPage) {
 *     loadNextPage()
 *   }
 * }
 *
 * @example
 * // Custom items per page
 * const { items } = useLoadPaginatedData(
 *   source,
 *   { itemsPerPage: 50, immediate: true }
 * )
 */
export function useLoadPaginatedData<Item = unknown>(
  source: PaginatedDataSource<Item>,
  options: Parameters<typeof useLoadData>[1] & {
    startingPage?: number;
    itemsPerPage?: number;
    append?: boolean;
  } = {},
): {
  items: Ref<Item[]>;
  pagination: Ref<Pagination | undefined>;
  isLoading: Ref<boolean>;
  hasLoaded: Ref<boolean>;
  loadPage: (page?: number) => Promise<PaginatedData<Item>>;
  loadNextPage: () => Promise<PaginatedData<Item> | undefined>;
  loadPreviousPage: () => Promise<PaginatedData<Item> | undefined>;
} {
  const items = ref<Item[]>([]) as Ref<Item[]>;

  const pagination = ref<Pagination>();

  const { immediate, initialValue: _initialValue, ...transferedOptions } = options;

  const { isLoading, hasLoaded, load } = useLoadData(source, transferedOptions);

  const loadPage = async (page: number = 1): Promise<PaginatedData<Item>> => {
    const results = await load({ page, itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE });

    items.value = results.items;
    pagination.value = results.pagination;

    return results;
  };

  const loadNextPage = async (): Promise<PaginatedData<Item> | undefined> => {
    if (!pagination.value?.hasNextPage) {
      return;
    }

    const results = await load({
      page: pagination.value!.currentPage + 1,
      itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
    });

    if (options.append) {
      items.value = [...items.value, ...results.items];
    } else {
      items.value = results.items;
    }

    pagination.value = results.pagination;

    return results;
  };

  const loadPreviousPage = async (): Promise<PaginatedData<Item> | undefined> => {
    if (!pagination.value?.hasPreviousPage) {
      return;
    }

    const results = await load({
      page: pagination.value!.currentPage - 1,
      itemsPerPage: options.itemsPerPage || DEFAULT_ITEMS_PER_PAGE,
    });

    if (options.append) {
      items.value = [...results.items, ...items.value];
    } else {
      items.value = results.items;
    }

    pagination.value = results.pagination;

    return results;
  };

  if (immediate) {
    onMounted(loadPage);
  }

  return {
    isLoading,
    hasLoaded,
    items,
    pagination,
    loadPage,
    loadNextPage,
    loadPreviousPage,
  };
}
