import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAllPairsCommand } from './remove-all-pairs.command';
import { DatabaseService } from 'src/infrastructure/database';

@CommandHandler(RemoveAllPairsCommand)
export class RemoveAllPairsCommandHandler
  implements ICommandHandler<RemoveAllPairsCommand>
{
  constructor(private readonly databaseService: DatabaseService) {}

  async execute(command: RemoveAllPairsCommand) {
    const { userId } = command;

    const pairs = (
      await this.databaseService.user.findUnique({
        where: { id: userId },
        select: { pairFor: { select: { id: true } } },
      })
    ).pairFor;
    await Promise.all(
      pairs.map(async (pair) => {
        await this.databaseService.user.update({
          where: { id: pair.id },
          data: { pairs: { disconnect: { id: userId } } },
        });
      }),
    );
    await this.databaseService.checkedUsers.deleteMany({
      where: { wasCheckedId: userId },
    });
  }
}
