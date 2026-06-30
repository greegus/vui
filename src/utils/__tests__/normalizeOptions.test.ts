import { describe, expect, it } from 'vitest'

import { normalizeGroups, normalizeOptions, retrieveValue } from '@/utils/normalizeOptions'

describe('retrieveValue', () => {
  it('returns the item itself without an extractor', () => {
    expect(retrieveValue('apple')).toBe('apple')
  })

  it('reads a property by key', () => {
    expect(retrieveValue({ id: 1, name: 'Apple' }, 'name')).toBe('Apple')
  })

  it('calls a function extractor', () => {
    expect(retrieveValue({ id: 1 }, (item) => item.id * 2)).toBe(2)
  })
})

describe('normalizeOptions', () => {
  it('normalizes a primitive string array', () => {
    expect(normalizeOptions(['Apple', 'Banana'])).toEqual([
      { value: 'Apple', label: 'Apple', disabled: undefined, description: undefined, icon: undefined, isSelected: undefined, data: 'Apple' },
      { value: 'Banana', label: 'Banana', disabled: undefined, description: undefined, icon: undefined, isSelected: undefined, data: 'Banana' },
    ])
  })

  it('stringifies the value but keeps the raw label for number arrays', () => {
    const [first] = normalizeOptions([1, 2, 3])

    expect(first.value).toBe('1')
    expect(first.label).toBe(1)
    expect(first.data).toBe(1)
  })

  it('normalizes an object array with key extractors', () => {
    const options = normalizeOptions([{ id: 1, name: 'Apple' }], { value: 'id', label: 'name' })

    expect(options[0]).toMatchObject({ value: '1', label: 'Apple', data: { id: 1, name: 'Apple' } })
  })

  it('supports function extractors', () => {
    const options = normalizeOptions([{ id: 7, first: 'Jane', last: 'Doe' }], {
      value: (user) => user.id,
      label: (user) => `${user.first} ${user.last}`,
    })

    expect(options[0]).toMatchObject({ value: '7', label: 'Jane Doe' })
  })

  it('normalizes a key-value object', () => {
    const options = normalizeOptions({ us: 'United States', uk: 'United Kingdom' })

    expect(options).toEqual([
      expect.objectContaining({ value: 'us', label: 'United States', data: 'us' }),
      expect.objectContaining({ value: 'uk', label: 'United Kingdom', data: 'uk' }),
    ])
  })

  it('extracts the disabled flag', () => {
    const options = normalizeOptions([{ id: 1, off: true }], { value: 'id', disabled: 'off' })

    expect(options[0]!.disabled).toBe(true)
  })

  it('marks the selected option via stringified comparison', () => {
    const options = normalizeOptions([1, 2, 3], {}, 2)

    expect(options.map((o) => o.isSelected)).toEqual([false, true, false])
  })

  it('returns an empty array for nullish input', () => {
    expect(normalizeOptions(null as any)).toEqual([])
  })
})

describe('normalizeGroups', () => {
  it('normalizes grouped arrays', () => {
    const groups = normalizeGroups(
      [{ category: 'Fruits', items: [{ id: 1, name: 'Apple' }] }],
      { groupLabel: 'category', groupOptions: 'items', value: 'id', label: 'name' },
    )

    expect(groups[0]!.label).toBe('Fruits')
    expect(groups[0]!.options[0]).toMatchObject({ value: '1', label: 'Apple' })
  })

  it('normalizes a key-value object of groups', () => {
    const groups = normalizeGroups({ Fruits: ['Apple', 'Banana'] })

    expect(groups[0]!.label).toBe('Fruits')
    expect(groups[0]!.options.map((o) => o.value)).toEqual(['Apple', 'Banana'])
  })
})
