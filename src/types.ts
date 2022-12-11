import { AsyncComponentLoader, Component } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export type InputSize = 'small' | 'normal' | 'large' | 'xlarge'

export type ButtonSize = InputSize

export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'danger'

export type ColumnOptions<T = any> = {
  label?: string
  align?: 'left' | 'right' | 'center'
  width?: string
  value?: (item: T) => unknown
  format?: (...params: any[]) => unknown
  href?: (item: T) => RouteLocationRaw
}

export type TableColumns<T = any> = Record<keyof T | string, string | ColumnOptions<T>>

export type Extractor = string | number | ((item: any) => string | number)

export type Option<T = any> = {
  value: string | number
  label: string
  disabled?: boolean
  description?: string
  data: T
  index?: number
}

export type Tabs = Record<string, string>

export type BreadcrumbItems = Record<string, RouteLocationRaw>

export declare type ValidationErrors<T = any> = {
  [key in keyof T]?: any
}

export declare type ValidationResults<T = any> = {
  isValid: boolean
  errors: ValidationErrors<T>
}

export type FormFieldValue = {
  getter: (modelValue: any) => unknown
  setter: (value: unknown, modelValue: any) => void
}

export type FormField = {
  label?: string
  description?: string
  hint?: string
  required?: boolean
  component: string | Component | AsyncComponentLoader
  props?: Record<string, unknown>
  value?: FormFieldValue
}

export type FormFieldsStructure<T extends any = any> = Record<keyof T | string, FormField>

export type FormStructure<T = any> = {
  title?: string
  separator?: boolean
  fields: FormFieldsStructure<T>
}[]
