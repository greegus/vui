import { computed, Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useRouteQuery<QueryParams extends Record<string, unknown> = Record<string, string>>(options: {
  onChange?: (params: QueryParams) => void
  filter?: (keyof QueryParams)[]
  parse?: Record<keyof QueryParams, (value: string) => any>
  serialize?: Record<keyof QueryParams, (value: QueryParams[keyof QueryParams]) => string>
  immediate?: boolean
}): {
  queryParams: Ref<QueryParams>
  setQuery: (params: Partial<QueryParams>) => void
  setQueryParam: (key: keyof QueryParams, value: unknown) => void
} {
  const router = useRouter()
  const route = useRoute()

  const queryParams = computed<QueryParams>(() => {
    let params = route.query as QueryParams

    if (options.filter?.length) {
      params = Object.fromEntries(
        Object.entries(params).filter(([key]) => options.filter?.includes(key))
      ) as QueryParams
    }

    params = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        decodeURIComponent(options.parse?.[key] ? options.parse[key](value as string) : value)
      ])
    ) as QueryParams

    return params
  })

  const setQuery = (params: Partial<QueryParams>) => {
    const valueIsNotEmpty = (value: any) =>
      value !== '' && value !== undefined && value !== null && (Array.isArray(value) ? value.length > 0 : true)

    const serializedParams = Object.fromEntries(
      Object.entries(params)
        .filter(([_key, value]) => valueIsNotEmpty(value))
        .map(([key, value]) => [
          key,
          encodeURIComponent(options.serialize?.[key] ? options.serialize[key](value) : value)
        ])
    ) as Record<string, string>

    return router.push({ query: serializedParams })
  }

  const setQueryParam = (key: keyof QueryParams, value: any) => {
    return setQuery({ ...(route.query as QueryParams), [key]: value })
  }

  watch(queryParams, () => options.onChange?.(queryParams.value), { immediate: options.immediate })

  return {
    queryParams,
    setQuery,
    setQueryParam
  }
}

export function usePageFromRouteQuery(options: { onChange?: (page: number) => void; immediate?: boolean }): {
  page: Ref<number>
  setPage: (page: number) => void
} {
  const { queryParams, setQuery } = useRouteQuery({
    onChange: (params) => options.onChange?.(params.page as any),
    filter: ['page'],
    parse: { page: (page) => Number(page) || 1 },
    immediate: options.immediate
  })

  const page = computed<number>(() => queryParams.value.page as any)

  const setPage = (page: number) => setQuery({ page: String(page) })

  return { page, setPage }
}
