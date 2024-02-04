import { type Component, defineAsyncComponent } from 'vue'

export type IconComponent = string | Component | undefined
export type IconResolver = (name: string) => IconComponent

const icons = import.meta.glob('../icons/*.vue', { as: 'component' })

let customIconResolver: IconResolver

function defaultIconResolver(name: string): IconComponent {
  const key = Object.keys(icons).find((path) => path.endsWith(`/${name}.vue`))

  if (key) {
    return defineAsyncComponent(icons[key] as any)
  }
}

export function registerCustomIconResolver(resolver: IconResolver) {
  customIconResolver = resolver
}

export function resolveIconComponent(name: string): IconComponent {
  let component

  if (customIconResolver) {
    component = customIconResolver(name)
  }

  if (!component) {
    component = defaultIconResolver(name)
  }

  if (!component) {
    console.error('Unable to resovle icon component for name: ' + name)
  }

  return component
}
