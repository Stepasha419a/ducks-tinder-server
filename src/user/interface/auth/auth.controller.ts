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
import { AuthAdapter } from 'user/application/adapter';
import {
  LoginUserDto,
  RegisterUserDto,
} from 'user/infrastructure/adapter/auth/command';
import { AuthUserWithoutRefreshToken } from './auth.interface';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly adapter: AuthAdapter) {}

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(
    @Res() res: Response,
    @Body() dto: RegisterUserDto,
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
    const authUserAggregate = await this.adapter.register(dto);
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
    const authUserAggregate = await this.adapter.login(dto);
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
    await this.adapter.logout(refreshToken);

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

    const authUserAggregate = await this.adapter.refresh(refreshToken);
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
