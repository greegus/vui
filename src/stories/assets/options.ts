export const plainArrayOptions: string[] = ['First option', 'Second option', 'Third option']

export const plainObjectOptions: Record<number, string> = {
  1: 'First option',
  2: 'Second option',
  3: 'Third option'
}

export const objectOptions: { value: string; label: string; disabled?: boolean; description?: string }[] = [
  { value: 'first', label: 'First option' },
  { value: 'second', label: 'Second option' },
  { value: 'forth', label: 'Disabled option', disabled: true },
  { value: 'third', label: 'Option with description', description: 'Details about the third option' }
]

export const groupedOptions: { label: string; options: string[] }[] = [
  {
    label: 'Group 1',
    options: plainArrayOptions
  },
  {
    label: 'Group 2',
    options: plainArrayOptions
  },
  {
    label: 'Group 3',
    options: plainArrayOptions
  }
]
