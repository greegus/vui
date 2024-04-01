import { computed, type ComputedRef, ref } from 'vue'

import type { ValidationResults } from '@/types'

export function useValidation<Data extends {} = any, Rules extends Data = any>(
  validation: (data: Partial<Data>) => ValidationResults<Rules> | Promise<ValidationResults<Rules>>
): {
  isValid: ComputedRef<boolean>
  isInvalid: ComputedRef<boolean>
  isValidating: ComputedRef<boolean>
  errorMessages: ComputedRef<ValidationResults<Rules>['errorMessages']>
  validatedFields: ComputedRef<ValidationResults<Rules>['validatedFields']>
  validate: (data: Partial<Data>) => Promise<boolean>
} {
  const results = ref<ValidationResults>()

  const isValidating = ref(false)

  const validate = async (data: Partial<Data>): Promise<boolean> => {
    isValidating.value = true

    results.value = await validation(data)

    isValidating.value = false

    return isValid.value
  }

  const isValid = computed<boolean>(() => results.value?.isValid ?? false)

  const isInvalid = computed<boolean>(() => !isValid.value)

  const errorMessages = computed<ValidationResults<Rules>['errorMessages']>(() =>
    results.value && !isValidating.value ? results.value.errorMessages : {}
  )

  const validatedFields = computed<ValidationResults<Rules>['validatedFields']>(
    () => results.value?.validatedFields ?? {}
  )

  return {
    isValidating: computed(() => isValidating.value),
    isValid,
    isInvalid,
    errorMessages,
    validatedFields,
    validate
  }
}
