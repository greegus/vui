import { describe, expect, it, vi } from 'vitest'

import { useLoadData } from '@/composables/useLoadData'

// useLoadData wraps useSubmitAction, which calls useRouter() during setup;
// provide a stub so it works outside a component.
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('useLoadData', () => {
  it('toggles isLoading around the load and stores the resolved data', async () => {
    let resolve!: (value: string[]) => void
    const pending = new Promise<string[]>((r) => (resolve = r))

    const { load, isLoading, data, hasLoaded } = useLoadData(() => pending)

    expect(isLoading.value).toBe(false)
    expect(hasLoaded.value).toBe(false)

    const loading = load()
    expect(isLoading.value).toBe(true)

    resolve(['a', 'b'])
    await loading

    expect(isLoading.value).toBe(false)
    expect(hasLoaded.value).toBe(true)
    expect(data.value).toEqual(['a', 'b'])
  })

  it('exposes the initial value before loading', () => {
    const { data } = useLoadData(() => Promise.resolve([1]), { initialValue: [] as number[] })

    expect(data.value).toEqual([])
  })

  it('records the error and resets isLoading on failure', async () => {
    const { load, isLoading, error, hasLoaded } = useLoadData(() => Promise.reject(new Error('boom')))

    await expect(load()).rejects.toThrow('boom')

    expect(error.value).toEqual(new Error('boom'))
    expect(isLoading.value).toBe(false)
    expect(hasLoaded.value).toBe(false)
  })
})
