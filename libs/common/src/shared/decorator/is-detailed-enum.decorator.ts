import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDetailedEnum(
  property: unknown,
  validationOptions?: ValidationOptions,
) {
  return function (
    object: Record<string, unknown> | unknown,
    propertyName: string,
  ) {
    if (!validationOptions) {
      validationOptions = {};
    }

    if (!validationOptions.message) {
      const each = validationOptions.each
        ? `each of ${propertyName} value`
        : propertyName;

      validationOptions.message = `${each} must be one of the following values: ${Object.values(
        property,
      )
        .filter((value) => typeof value === 'string')
        .join(', ')}`;
    }

    registerDecorator({
      name: 'isDetailedEnum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'string' &&
            Object.values(property)
              .filter((value) => typeof value === 'string')
              .includes(value)
          );
        },
      },
    });
  };
}
