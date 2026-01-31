# useValidation

Manages form validation state with async validation support.
Integrates with FormFields via the validatedFields computed property.

## Import

```typescript
import { useValidation } from 'vuiii'
```

## Usage

```typescript
// Basic validation
import { useValidation } from 'vuiii'
import type { ValidationResults } from 'vuiii'

type FormData = { email: string; password: string }

function validateForm(data: FormData): ValidationResults<FormData> {
  const errors: Record<string, string> = {}

  if (!data.email) errors.email = 'Email is required'
  if (!data.password) errors.password = 'Password is required'

  return {
    isValid: Object.keys(errors).length === 0,
    isInvalid: Object.keys(errors).length > 0,
    errorMessages: errors,
    validatedFields: {
      email: { isInvalid: !!errors.email, errorMessage: errors.email },
      password: { isInvalid: !!errors.password, errorMessage: errors.password }
    }
  }
}

const { validate, isValid, validatedFields } = useValidation(validateForm)
```

## More Examples

```typescript
// With FormFields integration
<FormFields
  :fields="fields"
  v-model="formData"
  :validation-results="validatedFields"
/>

async function submit() {
  if (await validate(formData)) {
    // form is valid, proceed with submission
  }
}
```

```typescript
// Async validation (e.g., server-side)
const { validate, isValidating } = useValidation(
  async (data) => {
    const result = await api.validateForm(data)
    return result
  }
)

// isValidating is true while validation is in progress
<Button :loading="isValidating" @click="validate(data)">Validate</Button>
```

