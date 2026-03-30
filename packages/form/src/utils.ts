export function hasValue(value: any): boolean {
  return value != null && !(Array.isArray(value) && value.length === 0);
}

// Determine if field is empty or filled.
// Response determines if label is presented above field or as placeholder.
//
// @param obj - Can be a string, an object with a value property (controlled input),
//              or an HTMLInputElement (uncontrolled input)
// @param SSR - If true, also checks defaultValue property for SSR/uncontrolled initial state
// @returns {boolean} False when not present or empty string.
//                    True when any number or string with length.
export function isFilled(obj: any, SSR = false): boolean {
  if (obj == null) {
    return false;
  }

  // Handle string values directly
  if (typeof obj === 'string') {
    return obj !== '';
  }

  // Handle objects with value property (controlled inputs, HTMLInputElement, etc.)
  if (obj && typeof obj === 'object') {
    // Check current value (works for both controlled { value: "..." } and HTMLInputElement)
    if (hasValue(obj.value) && obj.value !== '') {
      return true;
    }

    // Check defaultValue for SSR or uncontrolled initial state
    if (SSR && hasValue(obj.defaultValue) && obj.defaultValue !== '') {
      return true;
    }
  }

  return false;
}
