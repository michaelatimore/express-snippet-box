const emailRx =
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";

export function validateEmail(email: string) {
  if (!email) {
    throw new Error("Email is missing");
  }
  if (!email.match(emailRx)) {
    throw new Error("Invalid email format");
  }
}

export function validatePassword(password: string) {
  if (!password) {
    throw new Error("Password is missing");
  }
  if (password.length < 8) {
    throw new Error("Minimum password length is 8 characters");
  }
}

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

export function validateSnippetId(snippetId: number) {
  if (!snippetId || (typeof snippetId === 'string' && isNaN(parseInt(snippetId)))) {
    throw new Error("Invalid snippet ID");
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

