export const buttonSizes = ['normal', 'small'] as const
export const buttonVariants = ['default', 'primary', 'secondary', 'danger'] as const

export type ButtonSize = typeof buttonSizes[number]
export type ButtonVariant = typeof buttonVariants[number]
