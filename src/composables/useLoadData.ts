import type { Ref } from 'vue'
import type { Router } from 'vue-router'

import type { MaybePromise } from '@/types'

import { useSubmitAction } from '@/composables/useSubmitAction'
import { useDialogStack } from '@/dialogStack'
import { useSnackbar } from '@/snackbar'

export const useLoadData = <D = unknown, S extends (...args: any[]) => D = (...args: any[]) => D>(
  source: S,
  options: {
    onBeforeLoad?: (params: {
      params: Parameters<S>
      dialog: ReturnType<typeof useDialogStack>
      snackbar: ReturnType<typeof useSnackbar>
    }) => MaybePromise<boolean | undefined>
    onSuccess?: (params: { data: Awaited<ReturnType<S>>; params: Parameters<S>; router: Router }) => unknown
    onError?: (params: { error: Error; params: Parameters<S>; router: Router }) => boolean | void
    successMessage?: ((params: { data: Awaited<ReturnType<S>> | Promise<D>; params: Parameters<S> }) => string) | string
    errorMessage?: ((params: { error: Error; params: Parameters<S> }) => string) | string
    initialValue?: Awaited<ReturnType<S>>
    immediate?: boolean
  } = {}
): {
  load: S
  isLoading: Ref<boolean>
  hasLoaded: Ref<boolean>
  data: Ref<Awaited<ReturnType<S>>>
  error: Ref<Error | null>
} => {
  const {
    isSubmitting: isLoading,
    hasSubbmitted: hasLoaded,
    submit: load,
    result: data,
    error
  } = useSubmitAction(source, {
    onBeforeSubmit: options.onBeforeLoad
      ? ({ params, dialog, snackbar }) => options.onBeforeLoad!({ params, dialog, snackbar })
      : undefined,
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
    data,
    error
  }
}
