export type Option = {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
}

export type Extractor = string | number | ((item: any) => string | number)

function retrieveValue(item: any, extractor?: Extractor): any {
  if (typeof extractor === 'function') {
    return extractor(item)
  }

  if (extractor || extractor === 0) {
    return item[extractor]
  }

  return item
}

export function normalizeOptions(
  items: any[] | object,
  extractors: {
    value?: Extractor
    label?: Extractor
    disabled?: Extractor
    description?: Extractor
  } = {}
): Option[] {
  if (Array.isArray(items)) {
    return items.map((item) => ({
      value: retrieveValue(item, extractors.value),
      label: retrieveValue(item, extractors.label),
      description: extractors.description && retrieveValue(item, extractors.description),
      disabled: extractors.disabled && retrieveValue(item, extractors.disabled)
    }))
  }

  return Object.entries(items || {}).reduce((options, [value, label]) => {
    return options.concat({
      value,
      label
    })
  }, [] as Option[])
}
