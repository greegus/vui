import { onMounted, Ref, ref } from 'vue'
import { RouteLocationRaw, Router, useRouter } from 'vue-router'

import { useModal } from '../modal'
import { Snackbar, useSnackbar } from '../snackbar'
import { ValidationErrors, ValidationResults } from '../types'
import { ValidationError } from '../validations/validator'

type ConfirmParams = Parameters<ReturnType<typeof useModal>['confirm']>[0]

export function useSubmitAction<SubmittedData = unknown, Result = unknown>(
  action: (data: SubmittedData) => Result | Promise<Result>,
  options: {
    validator?: (
      data: SubmittedData
    ) => boolean | ValidationResults<SubmittedData> | Promise<ValidationResults<SubmittedData> | boolean>
    onValidationResults?: (errors?: ValidationErrors<SubmittedData>) => void
    confirm?: ((data: SubmittedData) => ConfirmParams) | ConfirmParams
    onSuccess?: (params: { result: Result; data: SubmittedData; router: Router; snackbar: Snackbar }) => void
    onError?: (params: { error: Error; data: SubmittedData; router: Router; snackbar: Snackbar }) => boolean | void
    redirectOnSuccess?: RouteLocationRaw | ((result: Result, data: SubmittedData) => RouteLocationRaw) | undefined
    successMessage?: ((result: Result, data: SubmittedData) => string) | string
    errorMessage?: ((error: Error, data: SubmittedData) => string) | string
    initialResultValue?: Result | undefined
    immediate?: boolean
  } = {}
): {
  submit: (data: SubmittedData) => Promise<Result>
  isSubmitting: Ref<boolean>
  result: Ref<Result>
  errors: Ref<ValidationErrors<SubmittedData>>
} {
  const snackbar = useSnackbar()
  const modal = useModal()
  const router = useRouter()

  const isSubmitting = ref<boolean>(false)
  const result = ref<Result>(options.initialResultValue as Result) as Ref<Result>
  const errors = ref<ValidationErrors<SubmittedData>>(Object.freeze({})) as Ref<ValidationErrors<SubmittedData>>

  const submit = async (data?: SubmittedData): Promise<Result> => {
    if (options.confirm && modal) {
      const confirmed = await modal.confirm(
        typeof options.confirm === 'function' ? options.confirm(data!) : options.confirm
      )

      if (!confirmed) {
        return undefined as any
      }
    }

    try {
      isSubmitting.value = true

      if (options.validator) {
        const validationResult = await options.validator(data!)

        options.onValidationResults?.(validationResult)

        if (!validationResult) {
          throw new ValidationError()
        }

        if (typeof validationResult === 'object') {
          errors.value = validationResult?.errors || {}

          if (!validationResult?.isValid) {
            throw new ValidationError()
          }
        }
      }

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
          return undefined as any
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
