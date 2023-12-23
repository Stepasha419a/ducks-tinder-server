import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePairsCommand } from './create-pairs.command';
import { PrismaService } from 'prisma/prisma.service';

@CommandHandler(CreatePairsCommand)
export class CreatePairsCommandHandler
  implements ICommandHandler<CreatePairsCommand>
{
  constructor(private readonly prismaService: PrismaService) {}

  async execute(command: CreatePairsCommand): Promise<void> {
    const { userId } = command;

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, sex: true },
    });

    const pairs = await this.prismaService.user.findMany({
      take: 20,
      where: { preferSex: user.sex },
    });

    await this.prismaService.user.update({
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
