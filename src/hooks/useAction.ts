import { onMounted, Ref, ref } from 'vue'
import { RouteLocationRaw, Router, useRouter } from 'vue-router'

import { useModal } from '../modal'
import { useSnackbar } from '../snackbar'

export declare type ValidationErrors<T = any> = {
  [key in keyof T]?: any
}

export declare type ValidationResults<T = any> = {
  isValid: boolean
  errors: ValidationErrors<T>
}

type ConfirmParams = Parameters<ReturnType<typeof useModal>['confirm']>[0]

export function useAction<T = unknown, R = unknown>(
  action: (data: T) => any | Promise<any>,
  params: {
    validator?: (data: T) => boolean | Promise<ValidationResults<T> | boolean>
    confirm?: ((data: T) => ConfirmParams) | ConfirmParams
    onSuccess?: (params: { result: R; data: T; router: Router }) => void
    onError?: (params: { error: Error; data: T; router: Router }) => boolean | void
    redirectOnSuccess?: RouteLocationRaw | ((result: R, data: T) => RouteLocationRaw) | undefined
    successMessage?: ((result: R, data: T) => string) | string
    errorMessage?: ((error: Error, data: T) => string) | string
    immediate?: boolean
  } = {}
): {
  submit: (data?: T) => Promise<any>
  isSubmitting: Ref<boolean>
  result: Ref<R>
  errors: Ref<ValidationErrors<T>>
} {
  const snackbard = useSnackbar()
  const modal = useModal()
  const router = useRouter()

  const isSubmitting = ref<boolean>(false)
  const result = ref<R>() as Ref<R>
  const errors = ref<ValidationErrors<T>>(Object.freeze({})) as Ref<ValidationErrors<T>>

  const submit = async (data?: T): Promise<R | undefined> => {
    if (params.confirm) {
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
      snackbard.error(
        typeof params.errorMessage === 'function'
          ? params.errorMessage(error as Error, data!)
          : params.errorMessage || (error as Error).message
      )

      isSubmitting.value = false

      if (params.onError) {
        const hasErrorBeenResolved = params.onError({ error: error as Error, data: data!, router })

        if (hasErrorBeenResolved) {
          return
        }
      }

      throw error
    }

    isSubmitting.value = false

    if (params.successMessage) {
      snackbard.success(
        typeof params.successMessage === 'function'
          ? params.successMessage(result.value!, data!)
          : params.successMessage
      )
    }

    params.onSuccess?.({ result: result.value!, data: data!, router })

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
