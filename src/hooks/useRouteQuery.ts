import { computed, Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export type QueryParams = Record<string, string | string[]>

export function useRouteQuery(
  onChange: (params: QueryParams) => void,
  options: {
    filter?: string[]
    parse?: Record<string, (value: string | string[]) => any>
    serialize?: Record<string, (value: any) => string | string[]>
    immediate?: boolean
  } = {}
): { params: Ref<QueryParams>; setQuery: (params: QueryParams) => void } {
  const route = useRoute()
  const router = useRouter()

  const params = computed<QueryParams>(() => {
    let params = route.query as QueryParams

    if (options.filter?.length) {
      params = Object.fromEntries(
        Object.entries(params).filter(([key]) => options.filter?.includes(key))
      ) as QueryParams
    }

    if (options.parse) {
      params = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, options.parse?.[key] ? options.parse[key](value) : value])
      ) as QueryParams
    }

    return params
  })

  const setQuery = (params: QueryParams) => {
    if (options.serialize) {
      params = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          options.serialize?.[key] ? options.serialize[key](value) : value
        ])
      ) as QueryParams
    }

    return router.push({ query: params })
  }

  watch(params, () => onChange(params.value), { immediate: options.immediate })

  return { params, setQuery }
}

export function usePageFromRouteQuery(
  onChange: (page: number) => void,
  options: { immediate?: boolean } = {}
): {
  page: Ref<number>
  setPage: (page: number) => void
} {
  const { params, setQuery } = useRouteQuery((query) => onChange(query.page as any), {
    filter: ['page'],
    parse: { page: (page) => Number(page) || 1 },
    immediate: options.immediate
  })

  const page = computed<number>(() => params.value.page as any)

  const setPage = (page: number) => setQuery({ page: String(page) })

  return { page, setPage }
}
