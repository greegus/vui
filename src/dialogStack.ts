/**
 * Dialog stack system for managing modal dialogs with promise-based APIs.
 * Supports custom dialog components, alerts, and confirmation dialogs.
 *
 * @module dialogStack
 *
 * @example
 * // Setup: Add DialogStack component to your app root
 * import { DialogStack } from 'vuiii'
 *
 * // In App.vue
 * <template>
 *   <router-view />
 *   <DialogStack />
 * </template>
 *
 * @example
 * // Open a simple alert
 * import { useDialogStack } from 'vuiii'
 *
 * const dialog = useDialogStack()
 * await dialog.alert('Operation completed!')
 *
 * @example
 * // Open a confirmation dialog
 * const confirmed = await dialog.confirm('Are you sure you want to delete?')
 * if (confirmed) {
 *   deleteItem()
 * }
 *
 * @example
 * // Open a confirmation with custom options
 * const confirmed = await dialog.confirm({
 *   title: 'Delete Item',
 *   content: 'This action cannot be undone.',
 *   confirmLabel: 'Delete',
 *   confirmVariant: 'danger',
 *   cancelLabel: 'Keep'
 * })
 *
 * @example
 * // Open a custom dialog component
 * import MyCustomDialog from './MyCustomDialog.vue'
 *
 * const result = await dialog.open(MyCustomDialog, { userId: 123 })
 * // result is whatever the dialog resolves with
 *
 * @example
 * // Inside a custom dialog component, use useCloseDialog
 * import { useCloseDialog } from 'vuiii'
 *
 * const close = useCloseDialog()
 *
 * // Close with result
 * close({ saved: true, data: formData })
 *
 * // Or with confirmation before close
 * const close = useCloseDialog((confirm) => {
 *   if (hasUnsavedChanges) {
 *     if (window.confirm('Discard changes?')) confirm()
 *   } else {
 *     confirm()
 *   }
 * })
 */
import { type Component, computed, markRaw, ref } from "vue";

import type { ButtonVariant, DialogLayoutButton } from "./types";

import { DialogLayout } from "./index";

export type Dialog<ResultType = any, DialogComponentProps = Record<string, any>> = {
  id: number;
  component: Component;
  props?: DialogComponentProps;
  resolve: (result: ResultType) => void;
  focusElement: HTMLElement | null;
  onBeforeClose?: (confirm: () => void) => void;
  modal?: boolean;
};

export type Config = Partial<{
  cancelLabel: string;
  confirmLabel: string;
}>;

export type DialogOptions = {
  title?: string;
  content?: string;
  buttons?: DialogLayoutButton[];
};

export type AlertOptions =
  | string
  | {
      title?: string;
      content?: string;
      confirmLabel?: string;
      confirmVariant?: ButtonVariant;
      confirmIcon?: string;
      modal?: boolean;
    };

export type ConfirmOptions =
  | string
  | {
      title?: string;
      content?: string;
      cancelLabel?: string;
      cancelVariant?: ButtonVariant;
      cancelIcon?: string;
      confirmLabel?: string;
      confirmVariant?: ButtonVariant;
      confirmIcon?: string;
      modal?: boolean;
    };

const defaultConfig: Config = {
  cancelLabel: "Cancel",
  confirmLabel: "OK",
};

const config = defaultConfig;

const iteration = ref<number>(1);

export const dialogs = ref<Dialog[]>([]);
export const activeDialog = computed(() => dialogs.value[dialogs.value.length - 1]);

const getId = (): number => {
  return iteration.value++;
};

/**
 * Opens a custom dialog component and returns a promise that resolves when the dialog is closed.
 *
 * @template ResultType - The type of result the dialog will return
 * @template DialogComponentProps - The props type for the dialog component
 * @param component - Vue component to render as dialog content
 * @param props - Props to pass to the dialog component
 * @param options - Additional options
 * @param options.modal - If true, prevents closing by clicking backdrop
 * @returns Promise that resolves with the result passed to closeDialog
 *
 * @example
 * const result = await openDialog(EditUserDialog, { userId: 123 })
 */
export const openDialog = <ResultType = any, DialogComponentProps = Record<string, any>>(
  component: Component,
  props?: DialogComponentProps,
  { modal }: { modal?: boolean } = {},
): Promise<ResultType> => {
  const focusElement = document.activeElement as HTMLElement;

  focusElement.blur?.();

  return new Promise((resolve) => {
    const dialog: Dialog<ResultType, DialogComponentProps> = {
      id: getId(),
      component: markRaw(component),
      props,
      resolve,
      focusElement,
      modal,
    };

    dialogs.value.push(dialog as Dialog);
  });
};

/**
 * Opens an alert dialog with a single confirmation button.
 *
 * @param options - Alert message string or options object
 * @returns Promise that resolves when the alert is dismissed
 *
 * @example
 * // Simple string message
 * await openAlert('File saved successfully!')
 *
 * @example
 * // With options
 * await openAlert({
 *   title: 'Success',
 *   content: 'Your changes have been saved.',
 *   confirmLabel: 'Great!',
 *   confirmVariant: 'primary'
 * })
 */
export const openAlert = (options: AlertOptions): Promise<void> => {
  if (typeof options === "string") {
    options = {
      content: options,
    };
  }

  const { title, content, confirmVariant, confirmLabel = config.confirmLabel, confirmIcon, modal } = options;

  return openDialog(DialogLayout, {
    title,
    content,
    modal,
    buttons: [
      {
        variant: confirmVariant || "primary",
        label: confirmLabel || "",
        icon: confirmIcon,
      },
    ],
  });
};

/**
 * Opens a confirmation dialog with cancel and confirm buttons.
 *
 * @param options - Confirmation message string or options object
 * @returns Promise that resolves to true (confirmed) or false (cancelled)
 *
 * @example
 * // Simple string message
 * const confirmed = await openConfirm('Delete this item?')
 *
 * @example
 * // With options
 * const confirmed = await openConfirm({
 *   title: 'Delete Item',
 *   content: 'This action cannot be undone.',
 *   cancelLabel: 'Keep',
 *   confirmLabel: 'Delete',
 *   confirmVariant: 'danger'
 * })
 */
export const openConfirm = (options: ConfirmOptions): Promise<boolean> => {
  if (typeof options === "string") {
    options = {
      content: options,
    };
  }

  const {
    title,
    content,
    cancelLabel = config.cancelLabel,
    cancelVariant,
    cancelIcon,
    confirmLabel = config.confirmLabel,
    confirmVariant,
    confirmIcon,
    modal,
  } = options;

  return openDialog(DialogLayout, {
    title,
    content,
    modal,
    buttons: [
      {
        variant: cancelVariant || "secondary",
        label: cancelLabel || "",
        icon: cancelIcon,
        value: false,
      },
      {
        variant: confirmVariant || "primary",
        label: confirmLabel || "",
        icon: confirmIcon,
        value: true,
      },
    ],
  });
};

const executeCloseDialog = (dialog: Dialog, result: any = undefined) => {
  dialogs.value = dialogs.value.filter((m) => m.id !== dialog.id);
  dialog.resolve(result);

  if (dialog.focusElement) {
    dialog.focusElement.focus?.();
  }
};

export const closeDialog = (dialog: Dialog, result: any = undefined) => {
  if (dialog.onBeforeClose) {
    dialog.onBeforeClose(() => executeCloseDialog(dialog, result));
  } else {
    executeCloseDialog(dialog, result);
  }
};

/**
 * Composable for closing the current dialog from within a dialog component.
 * Optionally allows intercepting close to confirm with the user.
 *
 * @param onBeforeClose - Optional callback to intercept close. Call confirm() to proceed.
 * @returns Function to close the dialog, optionally with a result value
 *
 * @example
 * // Simple close
 * const close = useCloseDialog()
 * close() // closes with undefined
 * close({ saved: true }) // closes with result
 *
 * @example
 * // With close confirmation
 * const close = useCloseDialog((confirm) => {
 *   if (hasChanges && !window.confirm('Discard changes?')) {
 *     return // don't close
 *   }
 *   confirm() // proceed with close
 * })
 */
export const useCloseDialog = (onBeforeClose?: (confirm: () => void) => void): ((result?: any) => void) => {
  if (onBeforeClose && activeDialog.value) {
    activeDialog.value.onBeforeClose = onBeforeClose;
  }

  return (result?: any) => {
    if (activeDialog.value) {
      closeDialog(activeDialog.value, result);
    }
  };
};

const context = {
  open: openDialog,
  alert: openAlert,
  confirm: openConfirm,
};

/**
 * Composable that provides access to dialog stack operations.
 *
 * @returns Object with open, alert, and confirm methods
 *
 * @example
 * import { useDialogStack } from 'vuiii'
 *
 * const dialog = useDialogStack()
 *
 * // Open custom dialog
 * const result = await dialog.open(MyDialog, { prop: 'value' })
 *
 * // Show alert
 * await dialog.alert('Success!')
 *
 * // Show confirmation
 * if (await dialog.confirm('Proceed?')) {
 *   doSomething()
 * }
 */
export function useDialogStack() {
  return context;
}
