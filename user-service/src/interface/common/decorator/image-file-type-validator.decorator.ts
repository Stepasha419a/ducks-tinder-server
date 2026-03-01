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
}
