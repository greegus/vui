# Composables

VUIII provides a set of Vue 3 composables for common application patterns.

## Data Loading

| Composable | Description |
|------------|-------------|
| [useLoadData](/composables/use-load-data) | Wrap data loading with loading state and error handling |
| [useLoadPaginatedData](/composables/use-load-paginated-data) | Paginated data loading with navigation |

## Form Actions

| Composable | Description |
|------------|-------------|
| [useSubmitAction](/composables/use-submit-action) | Async form submission with confirmation and redirect |
| [useValidation](/composables/use-validation) | Form validation state management |

## DOM Interactions

| Composable | Description |
|------------|-------------|
| [useOnClickOutside](/composables/use-on-click-outside) | Detect clicks outside an element |
| [useOnFocusOutside](/composables/use-on-focus-outside) | Detect focus leaving an element |
| [useOnKeyPress](/composables/use-on-key-press) | Handle keyboard events |
| [useCursor](/composables/use-cursor) | Navigate through arrays with cursor position |

## File Handling

| Composable | Description |
|------------|-------------|
| [useDropArea](/composables/use-drop-area) | Enable drag-and-drop file handling |
| [usePreventHandlingDrop](/composables/use-prevent-handling-drop) | Prevent default drop behavior |

## Routing

| Composable | Description |
|------------|-------------|
| [useRouteQuery](/composables/use-route-query) | Sync state with URL query parameters |
| [usePageFromRouteQuery](/composables/use-page-from-route-query) | Pagination from route query |
