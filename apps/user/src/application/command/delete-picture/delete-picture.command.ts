export class DeletePictureCommand {
  constructor(
    public readonly userId: string,
    public readonly pictureId: string,
  ) {}
}
