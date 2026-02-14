/**
 * Core type definitions for vuiii components.
 * Import these types for TypeScript support in your application.
 *
 * @module types
 *
 * @example
 * import type {
 *   TableColumn,
 *   FormField,
 *   Option,
 *   InputSize,
 *   ButtonVariant,
 *   ValidationResults
 * } from 'vuiii'
 */
import type { AsyncComponentLoader, Component, Ref } from "vue";
import type { RouteLocationRaw } from "vue-router";

/** String that can be a key of T or any string (for flexible typing) */
export type ObjectKeyOrAnyString<T> = (keyof T & string) | (string & {});

/** Value that may be a promise */
export type MaybePromise<T> = T | Promise<T>;

/** String literal type that also accepts any string */
export type ConstOrAnyString<T extends string> = T | (string & {});

/** Size variants for inputs and icons: 'small' | 'normal' | 'large' */
export type InputSize = "small" | "normal" | "large";

/** Size variants for icons (same as InputSize) */
export type IconSize = InputSize;

/** Button color variants: 'default' | 'primary' | 'secondary' | 'danger' */
export type ButtonVariant = "default" | "primary" | "secondary" | "danger";

/** Configuration for dialog action buttons */
export type DialogLayoutButton = {
  variant?: ButtonVariant;
  label: string;
  icon?: string;
  value?: any;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * Configuration for a Table column.
 *
 * @template T - The type of items in the table
 *
 * @example
 * const columns: TableColumn<User>[] = [
 *   { name: 'name', label: 'Name', sortable: true },
 *   { name: 'email', label: 'Email' },
 *   {
 *     name: 'createdAt',
 *     label: 'Created',
 *     formatter: (date) => date.toLocaleDateString()
 *   },
 *   {
 *     name: 'profile',
 *     label: 'Profile',
 *     href: (user) => ({ name: 'user', params: { id: user.id } })
 *   }
 * ]
 */
export type TableColumn<T = any> = {
  name: ObjectKeyOrAnyString<T>;
  label?: string;
  align?: "left" | "right" | "center";
  width?: string;
  noPadding?: boolean;
  value?: (item: T, index: number) => unknown;
  formatter?: (value: any) => unknown;
  href?: (item: T) => RouteLocationRaw;
  target?: ConstOrAnyString<"_blank">;
  cellClass?: string | ((cell: { item: T; value: any }) => string);
  headerClass?: string;
  sortable?: boolean;
  sorter?: (a: any, b: any) => number;
};

/**
 * Property extractor - can be a key name or a function.
 * Used by Select, Autocomplete, etc. for extracting values from option items.
 */
export type Extractor = string | number | ((item: any) => string | number);

/**
 * Normalized option structure used by Select, Autocomplete, RadioGroup, CheckboxGroup.
 *
 * @template T - The original data type of the option
 *
 * @example
 * const option: Option<User> = {
 *   value: '123',
 *   label: 'John Doe',
 *   description: 'john@example.com',
 *   icon: 'user',
 *   data: { id: 123, name: 'John Doe', email: 'john@example.com' },
 *   isSelected: true
 * }
 */
export type Option<T = any> = {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
  data: T;
  index?: number;
  isSelected?: boolean;
};

export type OptionGroup<T = any> = {
  label: string;
  options: Option<T>[];
};

export type ValueParser<SerializedValueType = any, RawValueType = any> = {
  parse: (serializedValue: SerializedValueType) => RawValueType;
  stringify: (rawValue: RawValueType) => SerializedValueType;
};

export type Tabs = Record<string, string>;

export type BreadcrumbItems = {
  label: string;
  link: string | RouteLocationRaw;
}[];

/**
 * Custom getter/setter for form field value transformation.
 * Used when the field value doesn't directly map to a model property.
 */
export type FormFieldValue<T> = {
  getter: (modelValue: T) => unknown;
  setter: (value: unknown, modelValue: T) => T;
};

/**
 * Configuration for a FormFields field.
 *
 * @template Data - The form data type
 *
 * @example
 * const fields: FormField<UserData>[] = [
 *   {
 *     name: 'email',
 *     label: 'Email',
 *     component: Input,
 *     props: { type: 'email' },
 *     required: true
 *   },
 *   {
 *     name: 'role',
 *     label: 'Role',
 *     component: Select,
 *     props: { options: ['admin', 'user', 'guest'] },
 *     disabled: (value) => !value // disable based on current value
 *   },
 *   {
 *     name: 'fullName',
 *     label: 'Full Name',
 *     component: Input,
 *     value: {
 *       getter: (data) => `${data.firstName} ${data.lastName}`,
 *       setter: (val, data) => {
 *         const [first, last] = val.split(' ')
 *         return { ...data, firstName: first, lastName: last }
 *       }
 *     }
 *   }
 * ]
 */
export type FormField<Data extends {} = any> = {
  name: ObjectKeyOrAnyString<Data>;
  label?: string;
  description?: string;
  hint?: string;
  required?: boolean | ((value: any) => boolean);
  disabled?: boolean | ((value: any) => boolean);
  component: string | Component | AsyncComponentLoader;
  props?: Record<string, unknown>;
  value?: FormFieldValue<Data>;
};

export type FormFieldRow<Data extends {} = any> = FormField<Data>[];

export const FORM_DIVIDER = "–" as const;
export type FormDivider = typeof FORM_DIVIDER;

export type FormFieldOrRow<Data extends {} = any> = FormField<Data> | FormFieldRow<Data> | FormDivider;

// Pagination

export type Pagination = {
  currentPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
};

export type PaginatedData<Item = unknown> = {
  items: Item[];
  pagination: Pagination;
};

export type PaginatedDataSource<Item> = {
  (params: { page: number; itemsPerPage: number }): Promise<PaginatedData<Item>>;
};

/**
 * Results from useValidation. Used to display validation state in forms.
 *
 * @template Rules - The validation rules/fields type
 *
 * @example
 * function validate(data: FormData): ValidationResults<FormData> {
 *   const errors: Record<string, string> = {}
 *   if (!data.email) errors.email = 'Required'
 *
 *   return {
 *     isValid: Object.keys(errors).length === 0,
 *     isInvalid: Object.keys(errors).length > 0,
 *     errorMessages: errors,
 *     validatedFields: {
 *       email: { isInvalid: !!errors.email, errorMessage: errors.email || '' }
 *     }
 *   }
 * }
 */
export type ValidationResults<Rules extends {} = any> = {
  isValid: boolean;
  isInvalid: boolean;
  errorMessages: Partial<Record<keyof Rules, string>>;
  validatedFields: Record<keyof Rules, ValidationFieldResults>;
};

export type ValidationFieldResults = {
  isValid?: boolean;
  isInvalid?: boolean;
  errorMessage: string;
  validators?: any[];
};

export type ElementRef = Readonly<Ref<HTMLElement | null | undefined>>;

/** Keyboard shortcut definition for ShortcutIcon component */
export type Shortcut = {
  key: string;
  shift?: boolean;
  alt?: boolean;
  mod?: boolean;
  ctrl?: boolean;
};
