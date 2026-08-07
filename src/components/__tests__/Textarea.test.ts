import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { h } from 'vue'

import Textarea from '@/components/Textarea.vue'
import { registerCustomIconResolver } from '@/utils/iconsResolver'

beforeAll(() => {
  registerCustomIconResolver((name) => ({
    name: 'StubIcon',
    render: () => h('i', { 'class': 'stub-icon', 'data-icon': name }),
  }))
})

describe('Textarea', () => {
  it('reflects the model value in the textarea element', () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'hello' } })

    expect(wrapper.find('textarea').element.value).toBe('hello')
  })

  it('emits update:modelValue with the typed text on input', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' } })

    const textarea = wrapper.find('textarea')
    textarea.element.value = 'a longer story'
    await textarea.trigger('input')

    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['a longer story'])
  })

  it('renders the updated model value when the prop changes', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'first' } })

    await wrapper.setProps({ modelValue: 'second' })

    expect(wrapper.find('textarea').element.value).toBe('second')
  })

  it('renders an empty textarea when the model value is undefined', () => {
    const wrapper = mount(Textarea)

    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('passes rows and placeholder through to the textarea element', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: '' },
      attrs: { rows: '5', placeholder: 'Write your message...' },
    })

    const textarea = wrapper.find('textarea')

    expect(textarea.attributes('rows')).toBe('5')
    expect(textarea.attributes('placeholder')).toBe('Write your message...')
  })

  it('applies the class attribute to the wrapper and not to the textarea', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' }, attrs: { class: 'my-textarea' } })

    expect(wrapper.classes()).toContain('my-textarea')
    expect(wrapper.find('textarea').classes()).not.toContain('my-textarea')
  })

  it('marks the wrapper invalid when invalid is set', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', invalid: true } })

    expect(wrapper.classes()).toContain('vuiii-input--invalid')
  })

  it('applies the size modifier class to the wrapper', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', size: 'large' } })

    expect(wrapper.classes()).toContain('vuiii-input--large')
  })

  it('disables the textarea element when disabled is set', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', disabled: true } })

    expect(wrapper.find('textarea').attributes('disabled')).toBeDefined()
  })

  it('marks the textarea readonly when readonly is set', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', readonly: true } })

    expect(wrapper.find('textarea').attributes('readonly')).toBeDefined()
  })

  it('renders the resolved prefix icon', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', prefixIcon: 'pencil' } })

    const prefix = wrapper.find('.vuiii-input__prefix-icon')

    expect(prefix.exists()).toBe(true)
    expect(prefix.find('.stub-icon').attributes('data-icon')).toBe('pencil')
  })

  it('renders no prefix icon by default', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' } })

    expect(wrapper.find('.vuiii-input__prefix-icon').exists()).toBe(false)
  })

  it('emits prefix-icon-click when the prefix icon is clicked', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '', prefixIcon: 'pencil' } })

    await wrapper.find('.vuiii-input__prefix-icon').trigger('click')

    expect(wrapper.emitted('prefix-icon-click')).toHaveLength(1)
  })

  it('renders the prefix slot instead of the prefix icon markup', () => {
    const wrapper = mount(Textarea, {
      props: { modelValue: '', prefixIcon: 'pencil' },
      slots: { prefix: '<span class="custom-prefix">@</span>' },
    })

    expect(wrapper.find('.custom-prefix').exists()).toBe(true)
    expect(wrapper.find('.vuiii-input__prefix-icon').exists()).toBe(false)
  })

  it('focuses the textarea when the wrapper is clicked', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' }, attachTo: document.body })

    await wrapper.trigger('click')

    expect(document.activeElement).toBe(wrapper.find('textarea').element)

    wrapper.unmount()
  })

  it('focuses the textarea through the exposed focus method', () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' }, attachTo: document.body })

    ;(wrapper.vm as unknown as { focus: () => void }).focus()

    expect(document.activeElement).toBe(wrapper.find('textarea').element)

    wrapper.unmount()
  })

  it('selects the textarea content through the exposed select method', () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'hello' }, attachTo: document.body })

    ;(wrapper.vm as unknown as { select: () => void }).select()

    const textarea = wrapper.find('textarea').element

    expect(textarea.selectionStart).toBe(0)
    expect(textarea.selectionEnd).toBe(5)

    wrapper.unmount()
  })
})
