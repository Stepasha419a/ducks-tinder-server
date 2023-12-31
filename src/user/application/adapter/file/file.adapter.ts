export abstract class FileAdapter {
  abstract savePicture(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string>;
  abstract deletePicture(fileName: string, userId: string): Promise<string>;
}
