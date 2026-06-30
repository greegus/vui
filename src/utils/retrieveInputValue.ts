export const retrieveInputValue = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.getAttribute('type') === 'number') {
    return target.valueAsNumber
  }

  if (target.getAttribute('type') === 'checkbox') {
    return target.checked
  }

  return target.value
}
