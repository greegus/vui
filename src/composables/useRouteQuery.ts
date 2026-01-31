import { computed, type Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Reactive binding for URL query parameters with Vue Router.
 * Supports filtering, parsing, serialization, and default values.
 *
 * @example
 * // Basic usage - sync filters with URL
 * import { useRouteQuery } from 'vuiii'
 *
 * const { queryParams, setQuery, setQueryParam } = useRouteQuery<{
 *   search: string
 *   category: string
 * }>({
 *   filter: ['search', 'category'],
 *   defaults: { category: 'all' }
 * })
 *
 * // Read current params
 * console.log(queryParams.value.search)
 *
 * // Update single param
 * setQueryParam('search', 'hello')
 *
 * // Update multiple params
 * setQuery({ search: 'hello', category: 'books' })
 *
 * @example
 * // With onChange callback for data fetching
 * const { queryParams } = useRouteQuery({
 *   filter: ['page', 'sort'],
 *   parse: { page: (v) => Number(v) || 1 },
 *   onChange: (params) => fetchData(params),
 *   immediate: true
 * })
 */

const valueIsNotEmpty = (value: any) => {
  return value !== "" && value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true);
};

export function useRouteQuery<QueryParams extends Record<string, unknown> = Record<string, string>>(options: {
  onChange?: (params: QueryParams) => void;
  filter?: (keyof QueryParams)[];
  parse?: Record<keyof QueryParams, (value: string) => any>;
  serialize?: Record<keyof QueryParams, (value: QueryParams[keyof QueryParams]) => string>;
  immediate?: boolean;
  defaults?: Partial<QueryParams>;
}): {
  queryParams: Ref<QueryParams>;
  setQuery: (params: Partial<QueryParams>) => void;
  setQueryParam: (key: keyof QueryParams, value: unknown) => void;
} {
  const router = useRouter();
  const route = useRoute();

  const queryParams = computed<QueryParams>(() => {
    let params = route.query as QueryParams;

    if (options.filter?.length) {
      params = Object.fromEntries(
        Object.entries(params).filter(([key]) => options.filter?.includes(key)),
      ) as QueryParams;
    }

    params = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        decodeURIComponent(options.parse?.[key] ? options.parse[key](value as string) : value),
      ]),
    ) as QueryParams;

    if (options.defaults) {
      Object.entries(options.defaults).forEach(([key, value]) => {
        if (params[key] === undefined) {
          params[key as keyof QueryParams] = value;
        }
      });
    }

    return params;
  });

  const serializeValue = (key: keyof QueryParams, value: any) => {
    return encodeURIComponent(options.serialize?.[key] ? options.serialize[key](value) : value);
  };

  const setQuery = (params: Partial<QueryParams>) => {
    const serializedParams = Object.fromEntries(
      Object.entries(params)
        .filter(([_key, value]) => valueIsNotEmpty(value))
        .map(([key, value]) => [key, serializeValue(key, value)]),
    ) as Record<string, string>;

    return router.push({
      query: serializedParams,
    });
  };

  const setQueryParam = (key: keyof QueryParams, value: any) => {
    const newQueryParams = {
      ...route.query,
    };

    newQueryParams[key as string] = valueIsNotEmpty(value) ? serializeValue(key, value) : (undefined as any);

    return router.push({ query: newQueryParams });
  };

  watch(queryParams, () => options.onChange?.(queryParams.value), { immediate: options.immediate });

  return {
    queryParams,
    setQuery,
    setQueryParam,
  };
}
