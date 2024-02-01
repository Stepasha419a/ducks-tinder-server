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
import { Public } from '@app/common/decorator';
import { AuthFacade } from 'apps/auth/src/application';
import {
  LoginUserDto,
  RegisterUserDto,
} from 'apps/auth/src/application/command';
import {
  AuthMapper,
  WithoutPrivateFields,
} from 'apps/auth/src/infrastructure/mapper';
import { MessagePattern, Payload } from '@nestjs/microservices';

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

  @MessagePattern('validate_access_token')
  async validateAccessToken(@Payload() accessTokenValue: string) {
    return this.facade.queries.validateAccessToken(accessTokenValue);
  }

  @MessagePattern('validate_refresh_token')
  async validateRefreshToken(@Payload() refreshTokenValue: string) {
    return this.facade.queries.validateRefreshToken(refreshTokenValue);
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
