<template>
  <InputWrapper
    ref="rootElement"
    class="Autocomplete"
    :class="$attrs.class"
    :size="$props.size"
    :invalid="$props.invalid"
    :disabled="$props.disabled"
    :prefixIcon="$props.prefixIcon"
    :suffixIcon="$props.suffixIcon"
    :pill="$props.pill"
    @click="inputElement?.focus()"
    @prefix-icon-click="$emit('prefix-icon-click')"
    @suffix-icon-click="$emit('suffix-icon-click')"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>

    <input
      ref="inputElement"
      v-bind="attrsWithoutClass"
      class="vuiii-input__nested Autocomplete__input"
      :class="inputClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="modelValue"
      @input="handleInput"
      @click="handleClick"
      @keydown="handleKeydown"
    />

    <FadeTransition :duration="100">
      <div v-if="isOpen && displayOptions.length > 0" class="Autocomplete__dropdown" ref="dropdownElement">
        <DropdownMenu
          class="Autocomplete__dropdownMenu"
          :items="displayOptions"
          :cursorIndex="cursorIndex"
          @itemClick="handleOptionSelect"
          @itemMouseenter="({ index }) => (cursorIndex = index)"
        >
          <template #itemLabel="{ item, index }">
            <slot name="option" :option="item" :index="index" :isHighlighted="cursorIndex === index">
              <div class="Autocomplete__optionLabel">{{ item.label }}</div>
              <div v-if="item.description" class="Autocomplete__optionDescription">{{ item.description }}</div>
            </slot>
          </template>
        </DropdownMenu>
      </div>
    </FadeTransition>

    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </InputWrapper>
</template>

<script lang="ts">
export type AutocompleteRef = {
  inputElement: HTMLInputElement;
  focus: () => void;
  blur: () => void;
  open: () => void;
  close: () => void;
};

export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup generic="T = any">
import { computed, ref, nextTick } from "vue";

import DropdownMenu from "@/components/DropdownMenu.vue";
import InputWrapper, {
  type InputWrapperEmits,
  type InputWrapperProps,
  type InputWrapperSlots,
} from "@/components/InputWrapper.vue";
import FadeTransition from "@/components/transitions/FadeTransition.vue";
import { useAttrsWithoutClass } from "@/composables/useAttrsWithoutClass";
import { useCursor } from "@/composables/useCursor";
import { useOnClickOutside } from "@/composables/useOnClickOutside";
import { usePopper } from "@/composables/usePopper";
import type { Extractor, Option } from "@/types";
import { normalizeGroups, normalizeOptions } from "@/utils/normalizeOptions";

export type AutocompleteFilterFn<T = any> = (option: Option<T>, query: string) => boolean;

const modelValue = defineModel<string>({ default: "" });

const props = withDefaults(
  defineProps<
    InputWrapperProps & {
      options: T[] | Record<string, any>;
      optionLabel?: Extractor;
      optionValue?: Extractor;
      optionDisabled?: Extractor;
      optionDescription?: Extractor;
      optionIcon?: Extractor;
      groupLabel?: Extractor;
      groupOptions?: Extractor;
      placeholder?: string;
      disabled?: boolean;
      inputClass?: any;
      filter?: AutocompleteFilterFn<T>;
    }
  >(),
  {
    size: "normal",
  },
);

const emit = defineEmits<
  InputWrapperEmits & {
    select: [option: Option<T>];
  }
>();

defineSlots<
  InputWrapperSlots & {
    option?: (props: { option: Option<T>; index: number; isHighlighted: boolean }) => any;
  }
>();

const attrsWithoutClass = useAttrsWithoutClass();

const rootElement = ref<InstanceType<typeof InputWrapper>>();
const dropdownElement = ref<HTMLDivElement>();
const inputElement = ref<HTMLInputElement>();

const isOpen = ref(false);

// Normalize options (flat list)
const normalizedOptions = computed<Option<T>[]>(() => {
  const extractors = {
    value: props.optionValue,
    label: props.optionLabel,
    disabled: props.optionDisabled,
    description: props.optionDescription,
    icon: props.optionIcon,
  };

  if (props.groupOptions) {
    const groups = normalizeGroups(
      props.options,
      {
        groupLabel: props.groupLabel,
        groupOptions: props.groupOptions,
        ...extractors,
      },
      modelValue.value,
    );
    // Flatten groups into a single array
    return groups.flatMap((group) => group.options);
  }

  return normalizeOptions(props.options, extractors, modelValue.value);
});

// Default filter function
function defaultFilter(option: Option<T>, searchQuery: string): boolean {
  if (!searchQuery) {
    return true;
  }

  const lowerQuery = searchQuery.toLowerCase();
  const label = String(option.label).toLowerCase();
  const description = option.description ? String(option.description).toLowerCase() : "";
  return label.includes(lowerQuery) || description.includes(lowerQuery);
}

// Filtered options based on modelValue
const filteredOptions = computed(() => {
  const filterFn = props.filter || defaultFilter;
  return normalizedOptions.value.filter((option) => filterFn(option, modelValue.value));
});

// Display options (what's shown in dropdown)
const displayOptions = computed(() => filteredOptions.value);

// Cursor navigation
const { cursorIndex, cursorItem, moveCursorForward, moveCursorBack, resetCursor } = useCursor(displayOptions);

// Computed ref for root element's $el
const rootEl = computed(() => rootElement.value?.$el as HTMLElement | undefined);

// Popper positioning
usePopper(rootEl, dropdownElement);

// Close on click outside
useOnClickOutside(rootEl, (event: MouseEvent) => {
  if (isOpen.value && !event.defaultPrevented) {
    event.preventDefault();
    close();
  }
});

function open() {
  if (isOpen.value || props.disabled) {
    return;
  }

  isOpen.value = true;
  resetCursor();
}

function close() {
  if (!isOpen.value) {
    return;
  }

  isOpen.value = false;
}

function handleInput(event: Event) {
  modelValue.value = (event.target as HTMLInputElement).value;
  open();
}

function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (!isOpen.value) {
        open();
      } else {
        moveCursorForward();
      }
      break;

    case "ArrowUp":
      event.preventDefault();
      if (isOpen.value) {
        moveCursorBack();
      }
      break;

    case "Enter":
      event.preventDefault();
      if (isOpen.value && cursorItem.value) {
        selectOption(cursorItem.value);
      }
      break;

    case "Escape":
      if (isOpen.value) {
        event.preventDefault();
        close();
      }

      break;

    case "Tab":
      close();
      break;
  }
}

function handleClick() {
  if (!isOpen.value) {
    open();
  }
}

function handleOptionSelect({ item }: { item: Option<T> }) {
  selectOption(item);
}

function selectOption(option: Option<T>) {
  if (option.disabled) {
    return;
  }

  modelValue.value = String(option.label);
  emit("select", option);

  close();

  nextTick(() => {
    inputElement.value?.focus();
  });
}

// Expose filter function and component methods
defineExpose({
  inputElement,
  focus: () => inputElement.value?.focus(),
  blur: () => inputElement.value?.blur(),
  open,
  close,
  filter: defaultFilter,
});
</script>

<style scoped>
.Autocomplete__input {
  width: 100%;
  appearance: none;
  text-overflow: ellipsis;
  align-self: stretch;
}

.Autocomplete__dropdown {
  position: absolute;
  width: max-content;
  min-width: 100%;
  z-index: var(--vuiii-zIndex-dropdown);
}

.Autocomplete__dropdownMenu {
  max-height: 320px;
  overflow: auto;
}

.Autocomplete__optionLabel {
  display: block;
}

.Autocomplete__optionDescription {
  display: block;
  font-size: var(--vuiii-fontSize--small);
  opacity: 0.7;
}
</style>
