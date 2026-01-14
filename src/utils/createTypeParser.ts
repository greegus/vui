import type { ValueParser } from '@/types'

export function createTypeParser(type: 'string' | 'number' | 'boolean' | 'date' = 'string'): ValueParser {
  const typeToParserMap: Record<typeof type, ValueParser> = {
    string: {
      stringify: (value) => (value === undefined || value === null ? '' : String(value)),
      parse: (value) => (value === '' ? undefined : String(value))
    },
    number: {
      stringify: (value) => (value === undefined || value === null ? '' : String(value)),
      parse: (value) => (value === '' ? undefined : Number(value))
    },
    boolean: {
      stringify: (value) => (value ? 'true' : 'false'),
      parse: (value) => value === 'true'
    },
    date: {
      stringify: (value) => new Date(value).toISOString(),
      parse: (value) => new Date(value)
    }
  }

  return typeToParserMap[type]
}
