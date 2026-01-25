/**
 * Utilities for normalizing various option formats into a consistent Option[] structure.
 * Used by Select, Autocomplete, RadioGroup, and CheckboxGroup components.
 *
 * @module normalizeOptions
 */
import type { Extractor, Option, OptionGroup } from "../types";

type Stringifier = (value: any) => string;

/**
 * Extracts a value from an item using an extractor (key, index, or function).
 * @internal
 */
export function retrieveValue(item: any, extractor?: Extractor): any {
  if (typeof extractor === "function") {
    return extractor(item);
  }

  if (extractor) {
    return item[extractor];
  }

  return item;
}

export function normalizeOption(
  item: any,
  extractors: {
    value?: Extractor;
    label?: Extractor;
    disabled?: Extractor;
    description?: Extractor;
    icon?: Extractor;
    stringifyValue?: Stringifier;
  } = {},
  selectedValue?: any,
): Option {
  const stringifyValue = extractors.stringifyValue || String;

  const value = stringifyValue(retrieveValue(item, extractors.value));

  return {
    value,
    label: retrieveValue(item, extractors.label),
    disabled: extractors.disabled && retrieveValue(item, extractors.disabled),
    description: extractors.description && retrieveValue(item, extractors.description),
    icon: extractors.icon && retrieveValue(item, extractors.icon),
    isSelected: selectedValue === undefined ? undefined : value === stringifyValue(selectedValue),
    data: item,
  };
}

/**
 * Normalizes various option formats into a consistent Option[] array.
 * Accepts arrays, objects, and supports custom extractors for complex data.
 *
 * @param items - Array of items or key-value object
 * @param extractors - Functions or keys to extract option properties
 * @param selectedValue - Currently selected value for isSelected marking
 * @returns Normalized Option[] array
 *
 * @example
 * // From string array
 * normalizeOptions(['apple', 'banana', 'cherry'])
 * // => [{ value: 'apple', label: 'apple', data: 'apple' }, ...]
 *
 * @example
 * // From object array with extractors
 * normalizeOptions(
 *   users,
 *   { value: 'id', label: 'name', disabled: 'isInactive' }
 * )
 *
 * @example
 * // From key-value object
 * normalizeOptions({ us: 'United States', uk: 'United Kingdom' })
 * // => [{ value: 'us', label: 'United States', data: 'us' }, ...]
 *
 * @example
 * // With function extractors
 * normalizeOptions(
 *   users,
 *   {
 *     value: (user) => user.id,
 *     label: (user) => `${user.firstName} ${user.lastName}`
 *   }
 * )
 */
export function normalizeOptions(
  items: any[] | { [value: string | number]: string },
  extractors: {
    value?: Extractor;
    label?: Extractor;
    disabled?: Extractor;
    description?: Extractor;
    icon?: Extractor;
    stringifyValue?: Stringifier;
  } = {},
  selectedValue?: any,
): Option[] {
  if (Array.isArray(items)) {
    return items.map((item) => normalizeOption(item, extractors, selectedValue));
  }

  if (typeof items === "object" && items !== null) {
    return Object.entries(items || {}).reduce((options, [value, label]) => {
      return options.concat({
        ...normalizeOption(value, extractors, selectedValue),
        label,
        data: value,
      });
    }, [] as Option[]);
  }

  return [];
}

export function normalizeGroups(
  items: any[] | { [label: string]: any[] },
  extractors: {
    groupLabel?: Extractor;
    groupOptions?: Extractor;
    value?: Extractor;
    label?: Extractor;
    disabled?: Extractor;
    description?: Extractor;
    icon?: Extractor;
    stringifyValue?: Stringifier;
  } = {},
  selectedValue?: any,
): OptionGroup[] {
  if (Array.isArray(items)) {
    return items.map((group) => ({
      label: retrieveValue(group, extractors.groupLabel),
      options: normalizeOptions(retrieveValue(group, extractors.groupOptions), extractors, selectedValue),
    }));
  }

  if (typeof items === "object" && items !== null) {
    return Object.entries(items || {}).reduce(
      (groups, [label, options]) =>
        groups.concat({ label, options: normalizeOptions(options, extractors, selectedValue) }),
      [] as OptionGroup[],
    );
  }

  return [];
}
