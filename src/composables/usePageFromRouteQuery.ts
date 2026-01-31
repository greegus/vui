import { computed, type Ref } from "vue";

import { useRouteQuery } from "./useRouteQuery";

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
 */
export function usePageFromRouteQuery(options: { onChange?: (page: number) => void; immediate?: boolean }): {
  page: Ref<number>;
  setPage: (page: number) => void;
} {
  const { queryParams, setQuery } = useRouteQuery({
    onChange: (params) => options.onChange?.(params.page as any),
    filter: ["page"],
    parse: { page: (page) => Number(page) || 1 },
    immediate: options.immediate,
  });

  const page = computed<number>(() => queryParams.value.page as any);

  const setPage = (page: number) => setQuery({ page: String(page) });

  return { page, setPage };
}
