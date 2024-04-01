import { computed } from 'vue'

export function useFilteredProps<Props extends {}>(props: Props, excluded: (keyof Props)[]) {
  excluded = [...excluded, 'modelValue', 'modelModifiers'] as (keyof Props)[]

  return computed(() => {
    return Object.fromEntries(Object.entries(props).filter(([key]) => !excluded.includes(key as keyof Props)))
  })
}
