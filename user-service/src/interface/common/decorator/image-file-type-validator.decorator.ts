import { FileValidator } from '@nestjs/common';
import { filetypemime } from 'magic-bytes.js';

export class ImageFileTypeValidator extends FileValidator {
  allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    if (!file) {
      return false;
    }

    const mime = filetypemime(file.buffer);

    return mime.some((item) => this.allowedMimeTypes.includes(item));
  }

  buildErrorMessage(file?: Express.Multer.File): string {
    if (!file) {
      return 'Validation failed (no file specified)';
    }

    const mime = filetypemime(file.buffer);
    const types = mime.length ? mime.join(', ') : 'unknown';

    return `Validation failed (current file type is ${types}, expected type is image/png, image/jpg, image/jpeg)`;
  }
}
