import type { AsyncComponentLoader, Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export type InputSize = 'small' | 'normal' | 'large'

export type IconSize = InputSize

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger'

export type ModalLayoutButton = {
  variant?: ButtonVariant
  label: string
  icon?: string
  value?: any
  disabled?: boolean
  loading?: boolean
}

export type TableColumn<T extends {} = any> = {
  name: (keyof T & string) | (string & {})
  label?: string
  align?: 'left' | 'right' | 'center'
  width?: string
  value?: (item: T) => unknown
  format?: (value: any) => unknown
  href?: (item: T) => RouteLocationRaw
  cellClass?: string | ((cell: { item: T; value: any }) => string)
}

export type Extractor = string | number | ((item: any) => string | number)

export type Option<T = any> = {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  data: T
  index?: number
}

export type OptionGroup<T = any> = {
  label: string
  options: Option<T>[]
}

export type Tabs = Record<string, string>

export type BreadcrumbItems = {
  label: string
  link: string | RouteLocationRaw
}[]

export type FormFieldValue = {
  getter: (modelValue: any) => unknown
  setter: (value: unknown, modelValue: any) => void
}

export type FormField<Data extends {} = any> = {
  name: keyof Data
  label?: string
  description?: string
  hint?: string
  required?: boolean | ((value: any) => boolean)
  disabled?: boolean | ((value: any) => boolean)
  component: string | Component | AsyncComponentLoader
  props?: Record<string, unknown>
  value?: FormFieldValue
}

// Pagination

export type Pagination = {
  currentPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  totalItems: number
  itemsPerPage: number
  totalPages: number
}

export type PaginatedData<Item = unknown> = {
  items: Item[]
  pagination: Pagination
}

export interface PaginatedDataSource<Item> {
  (params: { page: number; itemsPerPage: number }): Promise<PaginatedData<Item>>
}

// Validation

export type ValidationRules<Data extends {} = any> = Record<(keyof Data & string) | (string & {}), any>

export type ValidatedProps<Data extends {} = any> = Partial<
  Record<
    keyof ValidationRules<Data>,
    {
      errorMessage: string
      invalid: boolean
      validators: any[]
    }
  >
>

export type ValidationErrorMessages<Data extends {} = any> = Partial<
  Record<(keyof ValidationRules<Data> & string) | (string & {}), string>
>

export type ValidationResults<Data extends {} = any> = {
  isValid: boolean
  isInvalid: boolean
  errorMessages: ValidationErrorMessages<Data>
}

export type ValidationItemResult = {
  errorMessage: string
  isValid: boolean
  isInvalid: boolean
  validators: any[]
}
