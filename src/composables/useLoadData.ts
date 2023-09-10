import type { Ref } from 'vue'
import type { Router } from 'vue-router'

import { useSubmitAction } from './useSubmitAction'

export const useLoadData = <D = unknown, S extends (...args: any[]) => D = (...args: any[]) => D>(
  source: S,
  options: {
    onSuccess?: (params: { data: D | Promise<D>; params: Parameters<S>; router: Router }) => unknown
    onError?: (params: { error: Error; params: Parameters<S>; router: Router }) => boolean | void
    successMessage?: ((params: { data: D | Promise<D>; params: Parameters<S> }) => string) | string
    errorMessage?: ((params: { error: Error; params: Parameters<S> }) => string) | string
    initialValue?: Awaited<ReturnType<S>>
    immediate?: boolean
  } = {}
): {
  load: S
  isLoading: Ref<boolean>
  hasLoaded: Ref<boolean>
  data: Ref<Awaited<ReturnType<S>>>
} => {
  const {
    isSubmitting: isLoading,
    hasSubbmitted: hasLoaded,
    submit: load,
    result: data
  } = useSubmitAction(source, {
    onSuccess: ({ router, params, result }) => options.onSuccess?.({ data: result, params, router }),
    onError: ({ router, error, params }) => options.onError?.({ error, params, router }),
    successMessage:
      typeof options.successMessage === 'function'
        ? ({ params, result }) => (options.successMessage as any)({ data: result, params })
        : options.successMessage,
    errorMessage:
      typeof options.errorMessage === 'function'
        ? ({ params, error }) => (options.errorMessage as any)({ error, params })
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
