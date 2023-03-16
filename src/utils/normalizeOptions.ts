import type { Extractor, Option } from '../types'

export function retrieveValue(item: any, extractor?: Extractor): any {
  if (typeof extractor === 'function') {
    return extractor(item)
  }

  if (extractor) {
    return item[extractor]
  }

  return item
}

export function normalizeOption(
  item: any,
  extractors: {
    value?: Extractor
    label?: Extractor
    disabled?: Extractor
    description?: Extractor
  } = {}
): Option {
  return {
    value: retrieveValue(item, extractors.value),
    label: retrieveValue(item, extractors.label),
    disabled: extractors.disabled && retrieveValue(item, extractors.disabled),
    description: extractors.description && retrieveValue(item, extractors.description),
    data: item
  }
}

export function normalizeOptions(
  items: any[] | { [value: string | number]: string },
  extractors: {
    value?: Extractor
    label?: Extractor
    disabled?: Extractor
    description?: Extractor
  } = {}
): Option[] {
  if (Array.isArray(items)) {
    return items.map((item) => normalizeOption(item, extractors))
  }

  if (typeof items === 'object' && items !== null) {
    return Object.entries(items || {}).reduce((options, [value, label]) => {
      return options.concat({
        ...normalizeOption(label, extractors),
        value,
        data: value
      })
    }, [] as Option[])
  }

  return []
}
