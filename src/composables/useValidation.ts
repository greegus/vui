import { computed, type ComputedRef, ref } from "vue";

import type { ValidationResults } from "@/types";

/**
 * Manages form validation state with async validation support.
 * Integrates with FormFields via the validatedFields computed property.
 *
 * @template Data - The form data type
 * @template Rules - The validation rules type (usually same as Data keys)
 * @param validation - Validation function that returns ValidationResults
 * @returns Object with validation state and validate method
 *
 * @example
 * // Basic validation
 * import { useValidation } from 'vuiii'
 * import type { ValidationResults } from 'vuiii'
 *
 * type FormData = { email: string; password: string }
 *
 * function validateForm(data: FormData): ValidationResults<FormData> {
 *   const errors: Record<string, string> = {}
 *
 *   if (!data.email) errors.email = 'Email is required'
 *   if (!data.password) errors.password = 'Password is required'
 *
 *   return {
 *     isValid: Object.keys(errors).length === 0,
 *     isInvalid: Object.keys(errors).length > 0,
 *     errorMessages: errors,
 *     validatedFields: {
 *       email: { isInvalid: !!errors.email, errorMessage: errors.email },
 *       password: { isInvalid: !!errors.password, errorMessage: errors.password }
 *     }
 *   }
 * }
 *
 * const { validate, isValid, validatedFields } = useValidation(validateForm)
 *
 * @example
 * // With FormFields integration
 * <FormFields
 *   :fields="fields"
 *   v-model="formData"
 *   :validation-results="validatedFields"
 * />
 *
 * async function submit() {
 *   if (await validate(formData)) {
 *     // form is valid, proceed with submission
 *   }
 * }
 *
 * @example
 * // Async validation (e.g., server-side)
 * const { validate, isValidating } = useValidation(
 *   async (data) => {
 *     const result = await api.validateForm(data)
 *     return result
 *   }
 * )
 *
 * // isValidating is true while validation is in progress
 * <Button :loading="isValidating" @click="validate(data)">Validate</Button>
 *
 * @example
 * // Accessing error messages
 * const { errorMessages, isInvalid } = useValidation(validateFn)
 *
 * await validate(data)
 *
 * if (isInvalid.value) {
 *   console.log(errorMessages.value.email) // 'Email is required'
 * }
 */
export function useValidation<Data extends {} = any, Rules extends Data = any>(
  validation: (data: Partial<Data>) => ValidationResults<Rules> | Promise<ValidationResults<Rules>>,
): {
  isValid: ComputedRef<boolean>;
  isInvalid: ComputedRef<boolean>;
  isValidating: ComputedRef<boolean>;
  errorMessages: ComputedRef<ValidationResults<Rules>["errorMessages"]>;
  validatedFields: ComputedRef<ValidationResults<Rules>["validatedFields"]>;
  validate: (data: Partial<Data>) => Promise<boolean>;
} {
  const results = ref<ValidationResults>();

  const isValidating = ref(false);

  const validate = async (data: Partial<Data>): Promise<boolean> => {
    isValidating.value = true;

    results.value = await validation(data);

    isValidating.value = false;

    return isValid.value;
  };

  const isValid = computed<boolean>(() => results.value?.isValid ?? false);

  const isInvalid = computed<boolean>(() => !isValid.value);

  const errorMessages = computed<ValidationResults<Rules>["errorMessages"]>(() =>
    results.value && !isValidating.value ? results.value.errorMessages : {},
  );

  const validatedFields = computed<ValidationResults<Rules>["validatedFields"]>(
    () => results.value?.validatedFields ?? {},
  );

  return {
    isValidating: computed(() => isValidating.value),
    isValid,
    isInvalid,
    errorMessages,
    validatedFields,
    validate,
  };
}
