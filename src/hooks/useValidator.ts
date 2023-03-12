import { Ref, ref } from 'vue'

import { ValidationErrors, ValidationResults } from '../types'

export function useValidator<Data extends {} = any>(
  validator: (data: Partial<Data>) => ValidationResults<Data> | Promise<ValidationResults<Data>>
): {
  isValid: Ref<boolean>
  errors: Ref<ValidationErrors<Data>>
  validate: (data: Partial<Data>) => Promise<boolean>
} {
  const isValid = ref()

  const errors = ref<ValidationErrors<Data>>({}) as Ref<ValidationErrors<Data>>

  const validate = async (data: Partial<Data>): Promise<boolean> => {
    const { isValid: _isValid, errors: _errors } = await validator(data)

    isValid.value = _isValid
    errors.value = _errors

    return isValid.value
  }

  return {
    isValid,
    errors,
    validate
  }
}
