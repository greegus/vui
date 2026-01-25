import type { AsyncComponentLoader, Component, Ref } from "vue";
import type { RouteLocationRaw } from "vue-router";

export type ObjectKeyOrAnyString<T> = (keyof T & string) | (string & {});

export type MaybePromise<T> = T | Promise<T>;

export type ConstOrAnyString<T extends string> = T | (string & {});

export type InputSize = "small" | "normal" | "large";

export type IconSize = InputSize;

export type ButtonVariant = "default" | "primary" | "secondary" | "danger";

export type DialogLayoutButton = {
  variant?: ButtonVariant;
  label: string;
  icon?: string;
  value?: any;
  disabled?: boolean;
  loading?: boolean;
};

export type TableColumn<T = any> = {
  name: ObjectKeyOrAnyString<T>;
  label?: string;
  align?: "left" | "right" | "center";
  width?: string;
  value?: (item: T, index: number) => unknown;
  formatter?: (value: any) => unknown;
  href?: (item: T) => RouteLocationRaw;
  target?: ConstOrAnyString<"_blank">;
  cellClass?: string | ((cell: { item: T; value: any }) => string);
  sortable?: boolean;
  sorter?: (a: any, b: any) => number;
};

export type Extractor = string | number | ((item: any) => string | number);

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

export type FormFieldValue<T> = {
  getter: (modelValue: T) => unknown;
  setter: (value: unknown, modelValue: T) => T;
};

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

// Validation
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
