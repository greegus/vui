import { type Ref, onMounted, ref } from 'vue'
import { type RouteLocationRaw, type Router, useRouter } from 'vue-router'

import { useModal } from '../modal'
import { useSnackbar } from '../snackbar'

export function useSubmitAction<D = unknown, S extends (...args: any[]) => D = (...args: any[]) => D>(
  action: S,
  options: {
    onBeforeSubmit?: (params: {
      params: Parameters<typeof action>
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => boolean | Promise<boolean>
    onSuccess?: (params: {
      params: Parameters<typeof action>
      result: Awaited<ReturnType<S>>
      router: Router
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => void
    onError?: (params: {
      error: Error
      params: Parameters<typeof action>
      router: Router
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => boolean | void
    redirectOnSuccess?:
      | RouteLocationRaw
      | ((params: { result: Awaited<ReturnType<S>>; params: Parameters<typeof action> }) => RouteLocationRaw)
      | undefined
    successMessage?:
      | ((params: { result: Awaited<ReturnType<S>>; params: Parameters<typeof action> }) => string)
      | string
    errorMessage?: ((params: { error: Error; params: Parameters<typeof action> }) => string) | string
    initialResultValue?: Awaited<ReturnType<S>>
    immediate?: boolean
  } = {}
): {
  submit: (...params: Parameters<typeof action>) => Promise<ReturnType<S> | undefined>
  isSubmitting: Ref<boolean>
  hasSubbmitted: Ref<boolean>
  result: Ref<Awaited<ReturnType<S>>>
} {
  const snackbar = useSnackbar()
  const modal = useModal()
  const router = useRouter()

  const isSubmitting = ref<boolean>(false)
  const hasSubbmitted = ref<boolean>(false)
  const result = ref<Awaited<ReturnType<S>>>(options.initialResultValue as Awaited<ReturnType<S>>) as Ref<
    Awaited<ReturnType<S>>
  >

  const submit = async (...params: Parameters<typeof action>): Promise<ReturnType<S> | undefined> => {
    try {
      isSubmitting.value = true

      if (options.onBeforeSubmit) {
        const onBeforeSubmitResult = await options.onBeforeSubmit({ params, modal, snackbar })

        if (!onBeforeSubmitResult) {
          isSubmitting.value = false
          return undefined
        }
      }

      result.value = (await action(...params)) as Awaited<ReturnType<S>>
    } catch (error) {
      if (options.errorMessage && snackbar) {
        snackbar.error(
          typeof options.errorMessage === 'function'
            ? options.errorMessage({ error: error as Error, params })
            : options.errorMessage || (error as Error).message
        )
      }

      isSubmitting.value = false

      if (options.onError) {
        const hasErrorBeenResolved = options.onError({ error: error as Error, params, router, snackbar, modal })

        if (hasErrorBeenResolved) {
          return undefined
        }
      }

      throw error
    }

    hasSubbmitted.value = true
    isSubmitting.value = false

    if (options.successMessage && snackbar) {
      snackbar.success(
        typeof options.successMessage === 'function'
          ? options.successMessage({ result: result.value!, params })
          : options.successMessage
      )
    }

    options.onSuccess?.({ result: result.value!, params, router, snackbar, modal })

    if (options.redirectOnSuccess) {
      router.push(
        typeof options.redirectOnSuccess === 'function'
          ? options.redirectOnSuccess({ result: result.value, params })
          : options.redirectOnSuccess
      )
    }

    return result.value
  }

  if (options.immediate) {
    onMounted(submit)
  }

  return {
    submit,
    result,
    isSubmitting,
    hasSubbmitted
  }
}
