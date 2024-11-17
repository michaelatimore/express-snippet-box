const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

/**
 * Validate that the given string is a valid email address. If the input is
 * invalid, throws an Error with a description of the problem.
 */
export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email is missing");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
}

/**
 * Validate that the given password string is valid. If the password is invalid,
 * throws an Error with a description of the problem.
 *  */
export function validatePassword(password: string) {
  if (!password) {
    throw new Error("Password is missing");
  }
  if (password.length < 8) {
    throw new Error("Minimum password length is 8 characters");
  }
}

/**
 * Validate the provided inputs for creating a user account. This function checks
 * for the presence of required fields and validates specific constraints such as
 * the minimum password length.
 */
export function validateFields(
  email: string,
  firstName: string,
  lastName: string,
  password: string
) {
  validateEmail(email);
  if (!firstName) {
    throw new Error("First name is missing");
  }
  if (!lastName) {
    throw new Error("Last name is missing");
  }
  if (!password) {
    throw new Error("Password is missing");
  }
}

export function validateSnippetFields(title: string, content: string, expirationDate: number, userId: number) {
  if (!title) {
    throw new Error("Title is missing");
  }
  if (!content) {
    throw new Error("Content is missing");
  }
  if (!expirationDate || isNaN(expirationDate) || expirationDate <= 0) {
    throw new Error("Expiration date must be a positive number");
  }
  if (!userId || isNaN(userId)) {
    throw new Error("User ID must be a number");
  }
}
