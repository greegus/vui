import { Ref } from 'vue'
import { Router } from 'vue-router'

import { useSubmitAction } from './useSubmitAction'

export const useLoadData = <LoadedData = unknown, Parameters extends {} = any>(
  source: (params: Parameters) => Promise<LoadedData> | LoadedData,
  options: {
    onSuccess?: ({ data, params, router }: { data: LoadedData; params: Parameters; router: Router }) => void
    onError?: ({ error, params, router }: { error: Error; params: Parameters; router: Router }) => boolean | void
    successMessage?: ((data: LoadedData, params: Parameters) => string) | string
    errorMessage?: ((error: Error, params: Parameters) => string) | string
    initialValue?: LoadedData | undefined
    immediate?: boolean
  } = {}
): {
  load: (params: Parameters) => Promise<LoadedData>
  isLoading: Ref<boolean>
  hasLoaded: Ref<boolean>
  data: Ref<LoadedData>
} => {
  const {
    isSubmitting: isLoading,
    hasSubbmitted: hasLoaded,
    submit: load,
    result: data
  } = useSubmitAction<Parameters, LoadedData>(source, {
    onSuccess: ({ router, data, result }) => options.onSuccess?.({ data: result, params: data, router }),
    onError: ({ router, error, data }) => options.onError?.({ error, params: data, router }),
    successMessage: options.successMessage,
    errorMessage: options.errorMessage,
    immediate: options.immediate,
    initialResultValue: options.initialValue
  })

  return {
    load,
    isLoading,
    hasLoaded,
    data
  }
}
