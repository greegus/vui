import { describe, expect, it } from 'vitest'

import { useValidation } from '@/composables/useValidation'
import type { ValidationResults } from '@/types'

type FormData = { email: string }

function buildResults(email: string): ValidationResults<FormData> {
  const isInvalid = !email
  const errorMessage = isInvalid ? 'Email is required' : ''

  return {
    isValid: !isInvalid,
    isInvalid,
    errorMessages: isInvalid ? { email: errorMessage } : {},
    validatedFields: { email: { isInvalid, errorMessage } },
  }
}

describe('useValidation', () => {
  it('returns true and exposes state for valid data', async () => {
    const { validate, isValid, isInvalid, validatedFields } = useValidation((data: FormData) => buildResults(data.email))

    const result = await validate({ email: 'a@b.com' })

    expect(result).toBe(true)
    expect(isValid.value).toBe(true)
    expect(isInvalid.value).toBe(false)
    expect(validatedFields.value.email?.isInvalid).toBe(false)
  })

  it('returns false and exposes error messages for invalid data', async () => {
    const { validate, isInvalid, errorMessages } = useValidation((data: FormData) => buildResults(data.email))

    const result = await validate({ email: '' })

    expect(result).toBe(false)
    expect(isInvalid.value).toBe(true)
    expect(errorMessages.value.email).toBe('Email is required')
  })

  it('toggles isValidating around an async validation', async () => {
    const { validate, isValidating } = useValidation(
      (data: FormData) => Promise.resolve(buildResults(data.email)),
    )

    const pending = validate({ email: 'a@b.com' })
    expect(isValidating.value).toBe(true)

    await pending
    expect(isValidating.value).toBe(false)
  })

  it('resets isValidating even when the validation throws', async () => {
    const { validate, isValidating } = useValidation(() => {
      throw new Error('boom')
    })

    await expect(validate({ email: 'x' })).rejects.toThrow('boom')
    expect(isValidating.value).toBe(false)
  })
})
