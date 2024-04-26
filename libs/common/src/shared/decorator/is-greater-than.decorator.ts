import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (
    object: Record<string, unknown> | unknown,
    propertyName: string,
  ) {
    if (!validationOptions) {
      validationOptions = {
        message: `${propertyName} should be greater than the ${property}`,
      };
    }

    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value > relatedValue
          );
        },
      },
    });
  };
}
