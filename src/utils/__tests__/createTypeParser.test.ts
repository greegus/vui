import { describe, expect, it } from 'vitest'

import { createTypeParser } from '@/utils/createTypeParser'

describe('createTypeParser', () => {
  it('defaults to string parser', () => {
    const parser = createTypeParser()

    expect(parser.stringify('hello')).toBe('hello')
    expect(parser.parse('hello')).toBe('hello')
  })

  describe('string', () => {
    const parser = createTypeParser('string')

    it('stringifies nullish values to an empty string', () => {
      expect(parser.stringify(undefined)).toBe('')
      expect(parser.stringify(null)).toBe('')
    })

    it('parses an empty string to undefined', () => {
      expect(parser.parse('')).toBeUndefined()
      expect(parser.parse('abc')).toBe('abc')
    })
  })

  describe('number', () => {
    const parser = createTypeParser('number')

    it('round-trips numbers', () => {
      expect(parser.stringify(42)).toBe('42')
      expect(parser.parse('42')).toBe(42)
    })

    it('parses an empty string to undefined', () => {
      expect(parser.parse('')).toBeUndefined()
    })
  })

  describe('boolean', () => {
    const parser = createTypeParser('boolean')

    it('round-trips booleans', () => {
      expect(parser.stringify(true)).toBe('true')
      expect(parser.stringify(false)).toBe('false')
      expect(parser.parse('true')).toBe(true)
      expect(parser.parse('false')).toBe(false)
    })
  })

  describe('date', () => {
    const parser = createTypeParser('date')

    it('parses a date string into a Date', () => {
      const parsed = parser.parse('2020-01-15T00:00:00.000Z')

      expect(parsed).toBeInstanceOf(Date)
      expect((parsed as Date).toISOString()).toBe('2020-01-15T00:00:00.000Z')
    })

    it('stringifies a Date to ISO', () => {
      expect(parser.stringify(new Date('2020-01-15T00:00:00.000Z'))).toBe('2020-01-15T00:00:00.000Z')
    })
  })
})
