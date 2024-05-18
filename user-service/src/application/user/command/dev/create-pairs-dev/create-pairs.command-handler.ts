import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePairsCommand } from './create-pairs.command';
import { DatabaseService } from 'src/infrastructure/database';

@CommandHandler(CreatePairsCommand)
export class CreatePairsCommandHandler
  implements ICommandHandler<CreatePairsCommand>
{
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: CreatePairsCommand): Promise<void> {
    const { userId } = command;

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, sex: true },
    });

    const pairs = await this.databaseService.user.findMany({
      take: 20,
      where: { preferSex: user.sex },
    });

    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        pairs: {
          connect: pairs.map((pair) => ({
            id: pair.id,
          })),
        },
      },
    });
  }
}
