import { ValidationError } from 'class-validator';

export class DomainError extends Error {
  constructor(errors: ValidationError[], message?: string) {
    const _errors: string[] = [];

    if (errors.length) {
      errors.forEach((error) => {
        if (error.constraints) {
          Object.entries(error.constraints).forEach((value) => {
            _errors.push(value[1]);
          });
        }
      });
    }

    super(
      `Errors: ${_errors.join('; ')}${message ? `. Message: ${message}` : ''}}`,
    );

    this.name = 'DomainError';
  }
}
