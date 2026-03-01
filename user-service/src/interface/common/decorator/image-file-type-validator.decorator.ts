import { FileValidator } from '@nestjs/common';

export class ImageFileTypeValidator extends FileValidator {
  allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    return this.allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(file?: Express.Multer.File): string {
    if (!file) {
      return 'Validation failed (no file specified)';
    }

    return `Validation failed (current file type is ${file.mimetype}, expected type is image/png, image/jpg, image/jpeg)`;
  }
}
