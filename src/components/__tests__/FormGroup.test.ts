import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import FormGroup from '@/components/FormGroup.vue'

const slots = { default: '<input />' }

describe('FormGroup', () => {
  it('renders the label prop inside a label element', () => {
    const wrapper = mount(FormGroup, { props: { label: 'Email' }, slots })

    expect(wrapper.find('label').text()).toBe('Email')
  })

  it('renders no label element when neither the label prop nor the label slot is given', () => {
    const wrapper = mount(FormGroup, { slots })

    expect(wrapper.find('label').exists()).toBe(false)
  })

  it('renders the label slot in place of the label prop', () => {
    const wrapper = mount(FormGroup, {
      props: { label: 'Email' },
      slots: { ...slots, label: '<span class="custom-label">Work e-mail</span>' },
    })

    expect(wrapper.find('label').text()).toBe('Work e-mail')
    expect(wrapper.find('.custom-label').exists()).toBe(true)
  })

  it('links the label to the input id exposed by the default slot', () => {
    const wrapper = mount(FormGroup, {
      props: { label: 'Email' },
      slots: { default: '<template #default="{ id }"><input :id="id" /></template>' },
    })

    const id = wrapper.find('input').attributes('id')

    expect(id).toBeTruthy()
    expect(wrapper.find('label').attributes('for')).toBe(id)
  })

  it('uses the for prop as the label target instead of a generated id', () => {
    const wrapper = mount(FormGroup, {
      props: { label: 'Email', for: 'my-input' },
      slots: { default: '<template #default="{ id }"><input :id="id" /></template>' },
    })

    expect(wrapper.find('label').attributes('for')).toBe('my-input')
    expect(wrapper.find('input').attributes('id')).toBe('my-input')
  })

  it('renders the description when given', () => {
    const wrapper = mount(FormGroup, { props: { description: 'Choose a strong password' }, slots })

    expect(wrapper.find('.FormGroup__description').text()).toBe('Choose a strong password')
  })

  it('renders no description block by default', () => {
    const wrapper = mount(FormGroup, { slots })

    expect(wrapper.find('.FormGroup__description').exists()).toBe(false)
  })

  it('renders the description slot in place of the description prop', () => {
    const wrapper = mount(FormGroup, {
      props: { description: 'Plain' },
      slots: { ...slots, description: '<em>Rich</em>' },
    })

    expect(wrapper.find('.FormGroup__description').text()).toBe('Rich')
  })

  it('renders the hint when given', () => {
    const wrapper = mount(FormGroup, { props: { hint: 'At least 8 characters' }, slots })

    expect(wrapper.find('.FormGroup__hint').text()).toBe('At least 8 characters')
  })

  it('renders no hint block by default', () => {
    const wrapper = mount(FormGroup, { slots })

    expect(wrapper.find('.FormGroup__hint').exists()).toBe(false)
  })

  it('renders the hint slot in place of the hint prop', () => {
    const wrapper = mount(FormGroup, {
      props: { hint: 'Plain' },
      slots: { ...slots, hint: '<em>Rich</em>' },
    })

    expect(wrapper.find('.FormGroup__hint').text()).toBe('Rich')
  })

  it('shows the required indicator only when required is set', async () => {
    const wrapper = mount(FormGroup, { props: { label: 'Username' }, slots })

    expect(wrapper.find('.FormGroup__required').exists()).toBe(false)

    await wrapper.setProps({ required: true })

    expect(wrapper.find('.FormGroup__required').text()).toBe('*')
  })

  it('renders no error message and no invalid state by default', () => {
    const wrapper = mount(FormGroup, { props: { label: 'Username' }, slots })

    expect(wrapper.find('.FormGroup__error').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('FormGroup--invalid')
  })

  it('renders the error message and marks the group invalid when error is a string', () => {
    const wrapper = mount(FormGroup, { props: { label: 'Username', error: 'Username is taken' }, slots })

    expect(wrapper.find('.FormGroup__error').text()).toBe('Username is taken')
    expect(wrapper.classes()).toContain('FormGroup--invalid')
  })

  it('marks the group invalid without a message when error is boolean true', () => {
    const wrapper = mount(FormGroup, { props: { label: 'Username', error: true }, slots })

    expect(wrapper.classes()).toContain('FormGroup--invalid')
    expect(wrapper.find('.FormGroup__error').exists()).toBe(false)
  })

  it('stays valid when error is an empty string', () => {
    const wrapper = mount(FormGroup, { props: { label: 'Username', error: '' }, slots })

    expect(wrapper.classes()).not.toContain('FormGroup--invalid')
    expect(wrapper.find('.FormGroup__error').exists()).toBe(false)
  })

  it('shows the error message alongside the hint rather than replacing it', () => {
    const wrapper = mount(FormGroup, {
      props: { hint: 'At least 8 characters', error: 'Too short' },
      slots,
    })

    expect(wrapper.find('.FormGroup__hint').text()).toBe('At least 8 characters')
    expect(wrapper.find('.FormGroup__error').text()).toBe('Too short')
  })

  it('drops the error message once the error prop is cleared', async () => {
    const wrapper = mount(FormGroup, { props: { error: 'Too short' }, slots })

    await wrapper.setProps({ error: undefined })

    expect(wrapper.find('.FormGroup__error').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('FormGroup--invalid')
  })
})
