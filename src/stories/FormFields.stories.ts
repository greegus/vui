import { Meta, StoryFn } from '@storybook/vue3'

import Checkbox from '@/components/Checkbox.vue'
import FormFields from '@/components/FormFields.vue'
import Input from '@/components/Input.vue'
import RadioGroup from '@/components/RadioGroup.vue'
import Select from '@/components/Select.vue'
import type { FormFieldsStructure } from '@/types'

type FormData = {
  firstName: string
  lastName: string
  email: string
  gender: string
  position: string
  acceptTerms: boolean
}

export default {
  title: 'Example/FormFields',
  component: FormFields,
  parameters: {
    docs: {
      description: {
        component: 'Form fields'
      }
    }
  }
} as Meta<typeof FormFields>

const Template: StoryFn<typeof FormFields> = () => ({
  components: { FormFields },
  setup: () => {
    const fields: FormFieldsStructure<FormData> = {
      firstName: { component: Input, label: 'First Name', props: { required: true, placeholder: 'First name' } },
      lastName: { component: Input, label: 'Last Name', props: { required: true, placeholder: 'Last name' } },
      email: { component: Input, label: 'Email', props: { required: true, placeholder: 'Email', type: 'email' } },
      gender: { component: RadioGroup, label: 'Gender', props: { required: true, options: ['male', 'female'] } },
      position: {
        component: Select,
        label: 'Position',
        props: {
          required: true,
          placeholder: 'Select your position…',
          options: ['developer', 'manager', 'customer support']
        }
      },
      acceptTerms: { component: Checkbox, props: { label: 'Accept Terms' } }
    }

    const formData: Partial<FormData> = {}

    return {
      fields,
      formData
    }
  },
  template: `
    <FormFields :fields="fields" v-model="formData" />
`
})

export const Default = {
  render: Template
}
