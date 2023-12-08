import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get,
  Req,
  Res,
  Patch,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from 'common/decorators';
import { REFRESH_TOKEN_TIME } from 'tokens/tokens.constants';
import { CommandBus } from '@nestjs/cqrs';
import { LogoutCommand, RefreshCommand } from './legacy/commands';
import { UserData } from './auth.interface';
import { AuthUserFacade } from './application-services';
import { LoginUserDto, RegisterUserDto } from './application-services/commands';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly facade: AuthUserFacade,
  ) {}

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(
    @Res() res: Response,
    @Body() dto: RegisterUserDto,
  ): Promise<Response<UserData>> {
    const authUserAggregate = await this.facade.commands.register(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    return res.json(authUserAggregate.withoutPrivateFields());
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res() res: Response,
    @Body() dto: LoginUserDto,
  ): Promise<Response<UserData>> {
    const authUserAggregate = await this.facade.commands.login(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    return res.json(authUserAggregate.withoutPrivateFields());
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<void>> {
    const { refreshToken } = req.cookies;

    this.clearCookies(res);
    await this.commandBus.execute(new LogoutCommand(refreshToken));

    return res.end();
  }

  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<UserData>> {
    const { refreshToken } = req.cookies;

    const userData = await this.commandBus.execute(
      new RefreshCommand(refreshToken),
    );
    this.setCookies(res, userData.refreshToken);

    return res.json(userData.data);
  }

  private setCookies(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: REFRESH_TOKEN_TIME,
      httpOnly: true,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refreshToken');
  }
}
