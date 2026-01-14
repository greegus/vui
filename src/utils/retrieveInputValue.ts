export const retrieveInputValue = (event: any) => {
  if (event.target.getAttribute("type") === "number") {
    return event.target.valueAsNumber;
  }

  if (event.target.getAttribute("type") === "checkbox") {
    return event.target.checked;
  }

  return event.target.value;
};
