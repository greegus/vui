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
  options: {
    validator?: (data: D) => boolean | Promise<ValidationResults<D> | boolean>
    onValidationResults?: (errors?: ValidationErrors<D>) => void
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
    if (options.confirm && modal) {
      const confirmed = await modal.confirm(
        typeof options.confirm === 'function' ? options.confirm(data!) : options.confirm
      )

      if (!confirmed) {
        return
      }
    }

    if (options.validator) {
      const validationResult = await options.validator(data!)

      options.onValidationResults?.(validationResult)

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
      if (options.errorMessage && snackbar) {
        snackbar.error(
          typeof options.errorMessage === 'function'
            ? options.errorMessage(error as Error, data!)
            : options.errorMessage || (error as Error).message
        )
      }

      isSubmitting.value = false

      if (options.onError) {
        const hasErrorBeenResolved = options.onError({ error: error as Error, data: data!, router, snackbar })

        if (hasErrorBeenResolved) {
          return
        }
      }

      throw error
    }

    isSubmitting.value = false

    if (options.successMessage && snackbar) {
      snackbar.success(
        typeof options.successMessage === 'function'
          ? options.successMessage(result.value!, data!)
          : options.successMessage
      )
    }

    options.onSuccess?.({ result: result.value!, data: data!, router, snackbar })

    if (options.redirectOnSuccess) {
      router.push(
        typeof options.redirectOnSuccess === 'function'
          ? options.redirectOnSuccess(result.value!, data!)
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
    errors,
    result,
    isSubmitting
  }
}
