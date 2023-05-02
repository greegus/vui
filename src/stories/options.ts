export const options: { value: string; label: string; disabled?: boolean; description?: string }[] = [
  { value: 'first', label: 'First option' },
  { value: 'second', label: 'Second option' },
  { value: 'third', label: 'Third option', description: 'Details about the third option' },
  { value: 'forth', label: 'Forth option', disabled: true, description: 'Details about the forth option' }
]

export const plainOptions: string[] = ['First option', 'Second option', 'Third option']

export const groupedOptions: { label: string; options: string[] }[] = [
  {
    label: 'Group 1',
    options: plainOptions
  },
  {
    label: 'Group 2',
    options: plainOptions
  },
  {
    label: 'Group 3',
    options: plainOptions
  }
]
