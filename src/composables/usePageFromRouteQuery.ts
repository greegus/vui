import { computed, type Ref } from 'vue'

import { useRouteQuery } from './useRouteQuery'

/**
 * Simplified composable for pagination via URL query parameter.
 * Built on top of useRouteQuery, specifically for managing a 'page' parameter.
 *
 * @example
 * // Basic pagination
 * import { usePageFromRouteQuery } from 'vuiii'
 *
 * const { page, setPage } = usePageFromRouteQuery({
 *   onChange: (page) => loadPage(page),
 *   immediate: true
 * })
 *
 * // In template
 * <Pagination :current="page" @change="setPage" />
 *
 * @example
 * // Update the current history entry instead of pushing a new one, so paging through a list
 * // doesn't leave one back-button entry per page
 * const { page, setPage } = usePageFromRouteQuery({
 *   onChange: (page) => loadPage(page),
 *   replace: true
 * })
 */
export function usePageFromRouteQuery(options: {
  onChange?: (page: number) => void
  immediate?: boolean
  /** Use `router.replace()` instead of `router.push()`, so paging doesn't add browser-history entries. */
  replace?: boolean
}): {
  page: Ref<number>
  setPage: (page: number) => void
} {
  const { queryParams, setQueryParam } = useRouteQuery({
    onChange: (params) => options.onChange?.(params.page as any),
    filter: ['page'],
    parse: { page: (page) => Number(page) || 1 },
    // `parse` only runs for keys actually present in the query, so the first page has to be
    // supplied as a default rather than relying on the parser's fallback.
    defaults: { page: 1 },
    immediate: options.immediate,
    replace: options.replace,
  })

  const page = computed<number>(() => queryParams.value.page as any)

  // Set through setQueryParam, not setQuery, so that unrelated parameters (active filters,
  // sorting) survive a page change instead of being replaced wholesale.
  const setPage = (page: number) => setQueryParam('page', page)

  return { page, setPage }
}
