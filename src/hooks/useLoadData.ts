import { Ref } from 'vue'
import { Router } from 'vue-router'

import { useSubmitAction } from './useSubmitAction'

export const useLoadData = <D = unknown, P = unknown>(
  source: (params: P) => D | Promise<D>,
  options: {
    onSuccess?: ({ data, params, router }: { data: D; params: P; router: Router }) => void
    onError?: ({ error, params, router }: { error: Error; params: P; router: Router }) => boolean | void
    successMessage?: ((data: D, params: P) => string) | string
    errorMessage?: ((error: Error, params: P) => string) | string
    immediate?: boolean
  } = {}
): {
  load: () => Promise<D>
  isLoading: Ref<boolean>
  data: Ref<D>
} => {
  const {
    isSubmitting: isLoading,
    submit: load,
    result: data
  } = useSubmitAction<P, D>(source, {
    onSuccess: ({ router, data, result }) => options.onSuccess?.({ data: result, params: data, router }),
    onError: ({ router, error, data }) => options.onError?.({ error, params: data, router }),
    successMessage: options.successMessage,
    errorMessage: options.errorMessage,
    immediate: options.immediate
  })

  return {
    load,
    isLoading,
    data
  }
}
