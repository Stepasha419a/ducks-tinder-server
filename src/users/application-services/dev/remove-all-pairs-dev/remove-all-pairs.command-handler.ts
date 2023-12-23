import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveAllPairsCommand } from './remove-all-pairs.command';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(RemoveAllPairsCommand)
export class RemoveAllPairsCommandHandler
  implements ICommandHandler<RemoveAllPairsCommand>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: RemoveAllPairsCommand) {
    const { userId } = command;

    const pairs = (
      await this.prismaService.user.findUnique({
        where: { id: userId },
        select: { pairFor: { select: { id: true } } },
      })
    ).pairFor;
    await Promise.all(
      pairs.map(async (pair) => {
        await this.prismaService.user.update({
          where: { id: pair.id },
          data: { pairs: { disconnect: { id: userId } } },
        });
      }),
    );
    await this.prismaService.checkedUsers.deleteMany({
      where: { wasCheckedId: userId },
    });
  }
}
