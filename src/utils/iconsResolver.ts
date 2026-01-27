/**
 * Icon resolution system for the Icon component.
 * Allows registering custom icon libraries (Heroicons, FontAwesome, etc.)
 *
 * @module iconsResolver
 */
import { type Component, defineAsyncComponent, h } from "vue";

export type IconComponent = string | Component | undefined;

/** Function that resolves an icon name to a Vue component */
export type IconResolver = (name: string) => IconComponent;

const icons = import.meta.glob("../assets/icons/*.svg", {
  query: "?raw",
  import: "default",
});

let customIconResolver: IconResolver;

/** @internal Default resolver for built-in SVG icons */
function defaultIconResolver(name: string): IconComponent {
  const key = Object.keys(icons).find((path) => path.endsWith(`/${name}.svg`));

  const loader = key ? icons[key] : undefined;

  if (loader) {
    return defineAsyncComponent(async () => {
      const svgContent = (await loader()) as string;
      return {
        name: `Icon${name}`,
        render() {
          return h("span", {
            innerHTML: svgContent,
            class: "icon-svg-wrapper",
          });
        },
      };
    });
  }
}

/**
 * Registers a custom icon resolver for the Icon component.
 * The resolver function receives an icon name and should return a Vue component.
 *
 * @param resolver - Function that resolves icon names to Vue components
 *
 * @example
 * // With Heroicons
 * import * as HeroIcons from '@heroicons/vue/24/outline'
 *
 * registerCustomIconResolver((name) => {
 *   // Convert kebab-case to PascalCase: 'user-plus' -> 'UserPlusIcon'
 *   const pascalName = name
 *     .split('-')
 *     .map(s => s[0].toUpperCase() + s.slice(1))
 *     .join('') + 'Icon'
 *   return HeroIcons[pascalName]
 * })
 *
 * @example
 * // With async component loading
 * import { defineAsyncComponent } from 'vue'
 *
 * registerCustomIconResolver((name) => {
 *   return defineAsyncComponent(() => import(`./icons/${name}.vue`))
 * })
 *
 * @example
 * // With FontAwesome
 * import { library } from '@fortawesome/fontawesome-svg-core'
 * import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 * import * as icons from '@fortawesome/free-solid-svg-icons'
 *
 * registerCustomIconResolver((name) => {
 *   return h(FontAwesomeIcon, { icon: ['fas', name] })
 * })
 */
export function registerCustomIconResolver(resolver: IconResolver) {
  customIconResolver = resolver;
}

export function resolveIconComponent(name: string): IconComponent {
  let component;

  if (customIconResolver) {
    component = customIconResolver(name);
  }

  if (!component) {
    component = defaultIconResolver(name);
  }

  if (!component) {
    console.error("Unable to resolve icon component for name: " + name);
  }

  return component;
}
