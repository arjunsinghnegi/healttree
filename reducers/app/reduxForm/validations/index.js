export const required = field => value => value 
  // && value.trim() 
  ? undefined : ` ${field} is required`;
export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLength15 = maxLength(15);
export const number = value => value && isNaN(Number(value)) && !value.trim() ? 'Must be a number' : undefined;
const minValue = min => value =>
  value && value < min ? `Must be at least ${min}` : undefined;
export const onlyLetters = value => value && !/^[a-zA-Z]+$/.test(value) ? 'Special characters not allowed.' : undefined;
export const minValue18 = minValue(18)
export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' : undefined;
export const tooOld = value =>
  value && value > 65 ? 'You might be too old for this' : undefined;


export const requiredDropdown = field => value => value!=0 ? undefined : `required`;
