import { type Component, defineAsyncComponent, h } from "vue";

export type IconComponent = string | Component | undefined;
export type IconResolver = (name: string) => IconComponent;

const icons = import.meta.glob("../assets/icons/*.svg", {
  query: "?raw",
  import: "default",
});

let customIconResolver: IconResolver;

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
