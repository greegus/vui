import { type Ref, ref } from 'vue'

import type { ValidationErrorMessages, ValidationResults } from '../types'

export function useValidation<Data extends {} = any>(
  validation: (data: Partial<Data>) => ValidationResults<Data> | Promise<ValidationResults<Data>>
): {
  isValid: Ref<boolean>
  isValidating: Ref<boolean>
  errorMessages: Ref<ValidationErrorMessages<Data>>
  validate: (data: Partial<Data>) => Promise<boolean>
} {
  const isValid = ref()

  const isValidating = ref(false)

  const errorMessages = ref({}) as Ref<ValidationErrorMessages<Data>>

  const validate = async (data: Partial<Data>): Promise<boolean> => {
    isValidating.value = true
    errorMessages.value = {}

    const results = await validation(data)

    isValid.value = results.isValid
    errorMessages.value = results.errorMessages
    isValidating.value = false

    return isValid.value
  }

  return {
    isValid,
    isValidating,
    errorMessages,
    validate
  }
}
