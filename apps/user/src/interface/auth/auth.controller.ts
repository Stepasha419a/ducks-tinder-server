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
import { Public } from '@app/common/auth/decorator';
import { AuthFacade } from 'apps/user/src/application/auth';
import {
  LoginUserDto,
  RegisterUserDto,
} from 'apps/user/src/application/auth/command';
import {
  AuthMapper,
  WithoutPrivateFields,
} from '../../infrastructure/auth/mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly facade: AuthFacade,
    private readonly mapper: AuthMapper,
  ) {}

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.OK)
  async registration(
    @Res() res: Response,
    @Body() dto: RegisterUserDto,
  ): Promise<Response<WithoutPrivateFields>> {
    const authUserAggregate = await this.facade.commands.register(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      this.mapper.getWithoutPrivateFields(authUserAggregate);
    return res.json(withoutPrivateFields);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res() res: Response,
    @Body() dto: LoginUserDto,
  ): Promise<Response<WithoutPrivateFields>> {
    const authUserAggregate = await this.facade.commands.login(dto);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      this.mapper.getWithoutPrivateFields(authUserAggregate);
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
  ): Promise<Response<WithoutPrivateFields>> {
    const { refreshToken } = req.cookies;

    const authUserAggregate = await this.facade.commands.refresh(refreshToken);
    this.setCookies(res, authUserAggregate.refreshToken.value);

    const withoutPrivateFields =
      this.mapper.getWithoutPrivateFields(authUserAggregate);
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
