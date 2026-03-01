import { FileValidator } from '@nestjs/common';

export class ImageFileTypeValidator extends FileValidator {
  allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor() {
    super({});
  }
}
