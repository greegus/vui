import { onMounted, type Ref, ref } from "vue";
import { type RouteLocationRaw, type Router, useRouter } from "vue-router";

import type { MaybePromise } from "@/types";

import { useDialogStack } from "@/dialogStack";
import { useSnackbar } from "@/snackbar";

/**
 * Wraps an async action with submission state tracking, error handling,
 * success/error messages, and optional redirect on success.
 *
 * @template D - The return type of the action
 * @template S - The action function type
 * @param action - Async function to wrap
 * @param options - Configuration options
 * @param options.onBeforeSubmit - Called before action. Return false to cancel.
 * @param options.onSuccess - Called after successful completion
 * @param options.onError - Called on error. Return true if error was handled.
 * @param options.redirectOnSuccess - Route to navigate to after success
 * @param options.successMessage - Snackbar message on success
 * @param options.errorMessage - Snackbar message on error
 * @param options.initialResultValue - Initial value for result ref
 * @param options.immediate - Execute action immediately on mount
 * @returns Object with submit function and reactive state
 *
 * @example
 * // Basic form submission
 * import { useSubmitAction } from 'vuiii'
 *
 * const { submit, isSubmitting } = useSubmitAction(
 *   (data) => api.createUser(data),
 *   {
 *     successMessage: 'User created!',
 *     errorMessage: 'Failed to create user',
 *     redirectOnSuccess: { name: 'users' }
 *   }
 * )
 *
 * // In template
 * <Button :loading="isSubmitting" @click="submit(formData)">Save</Button>
 *
 * @example
 * // With confirmation before submit
 * const { submit, isSubmitting } = useSubmitAction(
 *   (id) => api.deleteUser(id),
 *   {
 *     onBeforeSubmit: async ({ dialog }) => {
 *       return await dialog.confirm('Are you sure?')
 *     },
 *     successMessage: 'User deleted'
 *   }
 * )
 *
 * @example
 * // With dynamic messages
 * const { submit, result } = useSubmitAction(
 *   (data) => api.saveItem(data),
 *   {
 *     successMessage: ({ result }) => `Saved item ${result.id}`,
 *     errorMessage: ({ error }) => `Error: ${error.message}`
 *   }
 * )
 *
 * @example
 * // Accessing the result
 * const { submit, result, hasSubbmitted } = useSubmitAction(
 *   () => api.fetchData()
 * )
 * await submit()
 * console.log(result.value) // data from api.fetchData()
 */
export function useSubmitAction<D = unknown, S extends (...args: any[]) => D = (...args: any[]) => D>(
  action: S,
  options: {
    onBeforeSubmit?: (params: {
      params: Parameters<typeof action>;
      dialog: ReturnType<typeof useDialogStack>;
      snackbar: ReturnType<typeof useSnackbar>;
    }) => MaybePromise<boolean | undefined>;
    onSuccess?: (params: {
      params: Parameters<typeof action>;
      result: Awaited<ReturnType<S>>;
      router: Router;
      dialog: ReturnType<typeof useDialogStack>;
      snackbar: ReturnType<typeof useSnackbar>;
    }) => void;
    onError?: (params: {
      error: Error;
      params: Parameters<typeof action>;
      router: Router;
      dialog: ReturnType<typeof useDialogStack>;
      snackbar: ReturnType<typeof useSnackbar>;
    }) => boolean | void;
    redirectOnSuccess?:
      | RouteLocationRaw
      | ((params: { result: Awaited<ReturnType<S>>; params: Parameters<typeof action> }) => RouteLocationRaw)
      | undefined;
    successMessage?:
      | ((params: { result: Awaited<ReturnType<S>>; params: Parameters<typeof action> }) => string)
      | string;
    errorMessage?: ((params: { error: Error; params: Parameters<typeof action> }) => string) | string;
    initialResultValue?: Awaited<ReturnType<S>>;
    immediate?: boolean;
  } = {},
): {
  submit: (...params: Parameters<typeof action>) => Promise<ReturnType<S> | undefined>;
  isSubmitting: Ref<boolean>;
  hasSubbmitted: Ref<boolean>;
  result: Ref<Awaited<ReturnType<S>>>;
  error: Ref<Error | null>;
} {
  const snackbar = useSnackbar();
  const dialog = useDialogStack();
  const router = useRouter();

  const isSubmitting = ref<boolean>(false);
  const hasSubbmitted = ref<boolean>(false);
  const error = ref<Error | null>(null);
  const result = ref<Awaited<ReturnType<S>>>(options.initialResultValue as Awaited<ReturnType<S>>) as Ref<
    Awaited<ReturnType<S>>
  >;

  const submit = async (...params: Parameters<typeof action>): Promise<ReturnType<S> | undefined> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (options.onBeforeSubmit) {
        const onBeforeSubmitResult = await options.onBeforeSubmit({ params, dialog, snackbar });

        if (onBeforeSubmitResult === false) {
          isSubmitting.value = false;
          return undefined;
        }
      }

      result.value = (await action(...params)) as Awaited<ReturnType<S>>;
    } catch (e) {
      error.value = e as Error;

      if (options.errorMessage && snackbar) {
        snackbar.error(
          typeof options.errorMessage === "function"
            ? options.errorMessage({ error: e as Error, params })
            : options.errorMessage || (e as Error).message,
        );
      }

      isSubmitting.value = false;

      if (options.onError) {
        const hasErrorBeenResolved = options.onError({ error: e as Error, params, router, snackbar, dialog });

        if (hasErrorBeenResolved) {
          return undefined;
        }
      }

      throw e;
    }

    hasSubbmitted.value = true;
    isSubmitting.value = false;

    if (options.successMessage && snackbar) {
      snackbar.success(
        typeof options.successMessage === "function"
          ? options.successMessage({ result: result.value!, params })
          : options.successMessage,
      );
    }

    options.onSuccess?.({ result: result.value!, params, router, snackbar, dialog });

    if (options.redirectOnSuccess) {
      router.push(
        typeof options.redirectOnSuccess === "function"
          ? options.redirectOnSuccess({ result: result.value, params })
          : options.redirectOnSuccess,
      );
    }

    return result.value;
  };

  if (options.immediate) {
    onMounted(submit);
  }

  return {
    submit,
    result,
    error,
    isSubmitting,
    hasSubbmitted,
  };
}
