import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Public } from 'common/decorators';
import { AuthUserWithoutRefreshToken } from './auth.interface';
import { Request, Response } from 'express';
import { AuthFacade } from 'user/application/facade/auth';
import {
  LoginUserDto,
  RegisterUserDto,
} from 'user/application/facade/auth/command';

@Controller('auth')
export class AuthController {
  constructor(private readonly facade: AuthFacade) {}

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(
    @Res() res: Response,
    @Body() dto: RegisterUserDto,
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
    const authUserAggregate = await this.facade.commands.register(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      await authUserAggregate.getWithoutPrivateFields();
    return res.json(withoutPrivateFields);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res() res: Response,
    @Body() dto: LoginUserDto,
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
    const authUserAggregate = await this.facade.commands.login(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      await authUserAggregate.getWithoutPrivateFields();
    return res.json(withoutPrivateFields);
  }

  @Patch('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<void>> {
    const { refreshToken } = req.cookies;

    this.clearCookies(res);
    await this.facade.commands.logout(refreshToken);

    return res.end();
  }

  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
    const { refreshToken } = req.cookies;

    const authUserAggregate = await this.facade.commands.refresh(refreshToken);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      await authUserAggregate.getWithoutPrivateFields();
    return res.json(withoutPrivateFields);
  }

  private REFRESH_TOKEN_TIME = 7 * 24 * 60 * 60 * 1000;

  private setCookies(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: this.REFRESH_TOKEN_TIME,
      httpOnly: true,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('refreshToken');
  }
}
