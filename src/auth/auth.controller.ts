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
import { AuthUserFacade } from './application-services';
import { LoginUserDto, RegisterUserDto } from './application-services/commands';
import { AuthUserWithoutRefreshToken } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly facade: AuthUserFacade) {}

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(
    @Res() res: Response,
    @Body() dto: RegisterUserDto,
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
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
  ): Promise<Response<AuthUserWithoutRefreshToken>> {
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

    return res.json(authUserAggregate.withoutPrivateFields());
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
