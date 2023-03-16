import { onMounted, Ref, ref } from 'vue'
import { type RouteLocationRaw, Router, useRouter } from 'vue-router'

import { useModal } from '../modal'
import { useSnackbar } from '../snackbar'

export function useSubmitAction<ActionParams extends any[] = any[], ActionResult = unknown | Promise<unknown>>(
  action: (...data: ActionParams) => ActionResult,
  options: {
    onBeforeSubmit?: (params: {
      data: ActionParams
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => boolean | Promise<boolean>
    onSuccess?: (params: {
      data: Parameters<typeof action>
      result: Awaited<ReturnType<typeof action>>
      router: Router
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => void
    onError?: (params: {
      error: Error
      data: Parameters<typeof action>
      router: Router
      modal: ReturnType<typeof useModal>
      snackbar: ReturnType<typeof useSnackbar>
    }) => boolean | void
    redirectOnSuccess?:
      | RouteLocationRaw
      | ((params: { result: Awaited<ReturnType<typeof action>>; data: Parameters<typeof action> }) => RouteLocationRaw)
      | undefined
    successMessage?:
      | ((params: { result: Awaited<ReturnType<typeof action>>; data: Parameters<typeof action> }) => string)
      | string
    errorMessage?: ((params: { error: Error; data: Parameters<typeof action> }) => string) | string
    initialResultValue?: Awaited<ReturnType<typeof action>> | undefined
    immediate?: boolean
  } = {}
): {
  submit: (...data: Parameters<typeof action>) => Promise<ReturnType<typeof action> | undefined>
  isSubmitting: Ref<boolean>
  hasSubbmitted: Ref<boolean>
  result: Ref<Awaited<ReturnType<typeof action>>>
} {
  const snackbar = useSnackbar()
  const modal = useModal()
  const router = useRouter()

  const isSubmitting = ref<boolean>(false)
  const hasSubbmitted = ref<boolean>(false)
  const result = ref<Awaited<ReturnType<typeof action>>>(
    options.initialResultValue as Awaited<ReturnType<typeof action>>
  ) as Ref<Awaited<ReturnType<typeof action>>>

  const submit = async (...data: Parameters<typeof action>): Promise<ReturnType<typeof action> | undefined> => {
    try {
      isSubmitting.value = true

      if (options.onBeforeSubmit) {
        const onBeforeSubmitResult = await options.onBeforeSubmit({ data, modal, snackbar })

        if (!onBeforeSubmitResult) {
          isSubmitting.value = false
          return undefined
        }
      }

      result.value = await action(...data)
    } catch (error) {
      if (options.errorMessage && snackbar) {
        snackbar.error(
          typeof options.errorMessage === 'function'
            ? options.errorMessage({ error: error as Error, data })
            : options.errorMessage || (error as Error).message
        )
      }

      isSubmitting.value = false

      if (options.onError) {
        const hasErrorBeenResolved = options.onError({ error: error as Error, data, router, snackbar, modal })

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
          ? options.successMessage({ result: result.value!, data })
          : options.successMessage
      )
    }

    options.onSuccess?.({ result: result.value!, data, router, snackbar, modal })

    if (options.redirectOnSuccess) {
      router.push(
        typeof options.redirectOnSuccess === 'function'
          ? options.redirectOnSuccess({ result: result.value, data })
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
