import { describe, expect, it, vi } from 'vitest'

import { useSubmitAction } from '@/composables/useSubmitAction'

// useSubmitAction calls useRouter() during setup; provide a stub so it works outside a component.
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('useSubmitAction', () => {
  it('runs the action and tracks success state', async () => {
    const { submit, isSubmitting, hasSubmitted, result, error } = useSubmitAction((value: number) =>
      Promise.resolve(value * 2),
    )

    const returned = await submit(21)

    expect(returned).toBe(42)
    expect(result.value).toBe(42)
    expect(hasSubmitted.value).toBe(true)
    expect(isSubmitting.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('cancels when onBeforeSubmit returns false', async () => {
    const action = vi.fn(() => Promise.resolve('done'))
    const { submit, hasSubmitted } = useSubmitAction(action, {
      onBeforeSubmit: () => false,
    })

    const returned = await submit()

    expect(returned).toBeUndefined()
    expect(action).not.toHaveBeenCalled()
    expect(hasSubmitted.value).toBe(false)
  })

  it('records the error, resets isSubmitting and rethrows', async () => {
    const { submit, isSubmitting, error } = useSubmitAction(() => Promise.reject(new Error('failed')))

    await expect(submit()).rejects.toThrow('failed')
    expect(error.value).toEqual(new Error('failed'))
    expect(isSubmitting.value).toBe(false)
  })

  it('swallows the error when onError marks it handled', async () => {
    const onError = vi.fn(() => true)
    const { submit } = useSubmitAction(() => Promise.reject(new Error('failed')), { onError })

    await expect(submit()).resolves.toBeUndefined()
    expect(onError).toHaveBeenCalledOnce()
  })
})
