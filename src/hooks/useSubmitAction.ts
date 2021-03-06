import { onMounted, Ref, ref } from 'vue'
import { RouteLocationRaw, Router, useRouter } from 'vue-router'

import { useModal } from '../modal'
import { Snackbar, useSnackbar } from '../snackbar'

export declare type ValidationErrors<T = any> = {
  [key in keyof T]?: any
}

export declare type ValidationResults<T = any> = {
  isValid: boolean
  errors: ValidationErrors<T>
}

type ConfirmParams = Parameters<ReturnType<typeof useModal>['confirm']>[0]

export function useSubmitAction<D = unknown, R = unknown>(
  action: (data: D) => any | Promise<any>,
  params: {
    validator?: (data: D) => boolean | Promise<ValidationResults<D> | boolean>
    confirm?: ((data: D) => ConfirmParams) | ConfirmParams
    onSuccess?: (params: { result: R; data: D; router: Router; snackbar: Snackbar }) => void
    onError?: (params: { error: Error; data: D; router: Router; snackbar: Snackbar }) => boolean | void
    redirectOnSuccess?: RouteLocationRaw | ((result: R, data: D) => RouteLocationRaw) | undefined
    successMessage?: ((result: R, data: D) => string) | string
    errorMessage?: ((error: Error, data: D) => string) | string
    immediate?: boolean
  } = {}
): {
  submit: (data?: D) => Promise<any>
  isSubmitting: Ref<boolean>
  result: Ref<R>
  errors: Ref<ValidationErrors<D>>
} {
  const snackbar = useSnackbar()
  const modal = useModal()
  const router = useRouter()

  const isSubmitting = ref<boolean>(false)
  const result = ref<R>() as Ref<R>
  const errors = ref<ValidationErrors<D>>(Object.freeze({})) as Ref<ValidationErrors<D>>

  const submit = async (data?: D): Promise<R | undefined> => {
    if (params.confirm && modal) {
      const confirmed = await modal.confirm(
        typeof params.confirm === 'function' ? params.confirm(data!) : params.confirm
      )

      if (!confirmed) {
        return
      }
    }

    if (params.validator) {
      const validationResult = await params.validator(data!)

      if (!validationResult) {
        return
      }

      if (typeof validationResult === 'object') {
        errors.value = validationResult?.errors || {}

        if (!validationResult?.isValid) {
          return
        }
      }
    }

    isSubmitting.value = true

    try {
      result.value = await action(data!)
    } catch (error) {
      if (params.errorMessage && snackbar) {
        snackbar.error(
          typeof params.errorMessage === 'function'
            ? params.errorMessage(error as Error, data!)
            : params.errorMessage || (error as Error).message
        )
      }

      isSubmitting.value = false

      if (params.onError) {
        const hasErrorBeenResolved = params.onError({ error: error as Error, data: data!, router, snackbar })

        if (hasErrorBeenResolved) {
          return
        }
      }

      throw error
    }

    isSubmitting.value = false

    if (params.successMessage && snackbar) {
      snackbar.success(
        typeof params.successMessage === 'function'
          ? params.successMessage(result.value!, data!)
          : params.successMessage
      )
    }

    params.onSuccess?.({ result: result.value!, data: data!, router, snackbar })

    if (params.redirectOnSuccess) {
      router.push(
        typeof params.redirectOnSuccess === 'function'
          ? params.redirectOnSuccess(result.value!, data!)
          : params.redirectOnSuccess
      )
    }

    return result.value
  }

  if (params.immediate) {
    onMounted(submit)
  }

  return {
    submit,
    errors,
    result,
    isSubmitting
  }
}
