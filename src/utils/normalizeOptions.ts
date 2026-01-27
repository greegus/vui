/**
 * Utilities for normalizing various option formats into a consistent Option[] structure.
 * Used by Select, Autocomplete, RadioGroup, CheckboxGroup, and RadioButtonGroup components.
 *
 * @module normalizeOptions
 *
 * ## Option Parsing
 *
 * Components that display selectable options (Select, Autocomplete, RadioGroup, CheckboxGroup,
 * RadioButtonGroup) support flexible option formats. The following props control how options
 * are parsed:
 *
 * ### Extractor Props
 *
 * | Prop | Description | Components |
 * |------|-------------|------------|
 * | `option-value` | Key or function to extract the option's value | All |
 * | `option-label` | Key or function to extract the display label | All |
 * | `option-disabled` | Key or function to determine if option is disabled | All |
 * | `option-description` | Key or function to extract description text | RadioGroup, CheckboxGroup, Autocomplete, RadioButtonGroup |
 * | `option-icon` | Key or function to extract icon name | Autocomplete, RadioButtonGroup |
 * | `group-label` | Key or function to extract group label | Select, Autocomplete |
 * | `group-options` | Key or function to extract group's options array | Select, Autocomplete |
 *
 * ### Supported Option Formats
 *
 * **1. Primitive Array** - Value and label are the same
 * ```ts
 * :options="['Apple', 'Banana', 'Cherry']"
 * :options="[1, 2, 3, 4, 5]"
 * ```
 *
 * **2. Object Array** - Use extractors to specify which properties to use
 * ```ts
 * :options="[{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }]"
 * option-value="id"
 * option-label="name"
 * ```
 *
 * **3. Key-Value Object** - Keys become values, values become labels
 * ```ts
 * :options="{ draft: 'Draft', published: 'Published', archived: 'Archived' }"
 * ```
 *
 * **4. Grouped Options** - For Select and Autocomplete with optgroup support
 * ```ts
 * :options="[
 *   { category: 'Fruits', items: [{ id: 1, name: 'Apple' }] },
 *   { category: 'Vegetables', items: [{ id: 2, name: 'Carrot' }] }
 * ]"
 * group-label="category"
 * group-options="items"
 * option-value="id"
 * option-label="name"
 * ```
 *
 * ### Function Extractors
 *
 * Instead of property keys, you can use functions for complex extraction:
 * ```ts
 * :option-label="(user) => `${user.firstName} ${user.lastName}`"
 * :option-value="(item) => item.id"
 * :option-disabled="(item) => item.status === 'inactive'"
 * ```
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
