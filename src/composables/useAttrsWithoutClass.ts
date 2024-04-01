import { computed, useAttrs } from 'vue'

export function useAttrsWithoutClass() {
  const attrs = useAttrs()

  return computed(() => {
    const { class: _class, ...rest } = attrs
    return rest
  })
}
