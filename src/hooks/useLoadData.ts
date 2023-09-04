import type { Ref } from 'vue'
import type { Router } from 'vue-router'

import { useSubmitAction } from '@/hooks/useSubmitAction'

export const useLoadData = <SourceParams extends any[] = any[], RetrievedData = unknown | Promise<unknown>>(
  source: (...params: SourceParams) => RetrievedData,
  options: {
    onSuccess?: (params: {
      data: Awaited<ReturnType<typeof source>>
      params: Parameters<typeof source>
      router: Router
    }) => unknown
    onError?: (params: { error: Error; params: Parameters<typeof source>; router: Router }) => boolean | void
    successMessage?:
      | ((params: { data: Awaited<ReturnType<typeof source>>; params: Parameters<typeof source> }) => string)
      | string
    errorMessage?: ((params: { error: Error; params: Parameters<typeof source> }) => string) | string
    initialValue?: Awaited<ReturnType<typeof source>> | undefined
    immediate?: boolean
  } = {}
): {
  load: typeof source
  isLoading: Ref<boolean>
  hasLoaded: Ref<boolean>
  data: Ref<Awaited<ReturnType<typeof source>>>
} => {
  const {
    isSubmitting: isLoading,
    hasSubbmitted: hasLoaded,
    submit: load,
    result: data
  } = useSubmitAction(source, {
    onSuccess: ({ router, data, result }) => options.onSuccess?.({ data: result, params: data, router }),
    onError: ({ router, error, data }) => options.onError?.({ error, params: data, router }),
    successMessage:
      typeof options.successMessage === 'function'
        ? ({ data, result }) => (options.successMessage as any)({ data: result, params: data })
        : options.successMessage,
    errorMessage:
      typeof options.errorMessage === 'function'
        ? ({ data, error }) => (options.errorMessage as any)({ error, params: data })
        : (options.errorMessage as string),
    immediate: options.immediate,
    initialResultValue: options.initialValue
  })

  return {
    load: load as typeof source,
    isLoading,
    hasLoaded,
    data
  }
}
