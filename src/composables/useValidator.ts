import { type Ref, ref } from 'vue'

import type { ValidationFieldResults, ValidationResults } from '@/types'

export function useValidator<Data extends {} = any>(
  validator: (data: Partial<Data>) => ValidationResults<Data> | Promise<ValidationResults<Data>>
): {
  isValid: Ref<boolean>
  isValidating: Ref<boolean>
  validationResults: Ref<Partial<ValidationFieldResults<Data>>>
  validate: (data: Partial<Data>) => Promise<boolean>
} {
  const isValid = ref()

  const isValidating = ref(false)

  const validationResults = ref<Partial<ValidationFieldResults<Data>>>({}) as Ref<Partial<ValidationFieldResults<Data>>>

  const validate = async (data: Partial<Data>): Promise<boolean> => {
    isValidating.value = true
    validationResults.value = {}

    const results = await validator(data)

    isValidating.value = false
    isValid.value = results.isValid
    validationResults.value = results.validationResults

    return isValid.value
  }

  return {
    isValid,
    isValidating,
    validationResults,
    validate
  }
}
