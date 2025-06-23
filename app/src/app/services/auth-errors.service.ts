// auth-errors.ts
export class AuthError extends Error {
  constructor(message: string, public userFriendlyMessage: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AuthError {
  constructor() {
    super('Network error', 'Unable to connect to server. Please check your internet connection.');
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid credentials', 'Invalid email or password. Please try again.');
  }
}

export class EmailInUseError extends AuthError {
  constructor() {
    super('Email in use', 'This email is already registered. Please use a different email.');
  }
}

export class ValidationError extends AuthError {
  constructor(public errors: Record<string, string[]>) {
    super('Validation is not terminated', 'Please correct the highlighted errors.');
  }
}