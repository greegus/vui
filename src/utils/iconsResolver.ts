import { Component } from 'vue'

import { resolveGlobImport } from './resolveGlobImport'

export type IconComponent = string | Component | undefined
export type IconResolver = (name: string) => IconComponent

let customIconResolver: IconResolver

const icons = import.meta.glob('../icons/*.vue', { eager: true, as: 'component' })

export function registerCustomIconResolver(resolver: IconResolver) {
  customIconResolver = resolver
}

export function resolveIconComponent(name: string): IconComponent {
  let component

  if (customIconResolver) {
    component = customIconResolver(name)
  }

  if (!component) {
    component = resolveGlobImport(icons, `${name}.vue`)
  }

  return component
}
