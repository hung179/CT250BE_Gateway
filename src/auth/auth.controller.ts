import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CustomerLocalAuthGuard } from './guards/customer_local-auth.guard';
import { AdminLocalAuthGuard } from './guards/admin_local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer-login')
  @UseGuards(CustomerLocalAuthGuard)
  async customerLogin(@Req() req, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        req.user,
        'customer'
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
      return res.json({ accessToken: accessToken, userId: req.user.userId });
    } catch (error) {
      return res.json(error);
    }
  }

  @Post('admin-login')
  @UseGuards(AdminLocalAuthGuard)
  async adminLogin(@Req() req, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        req.user,
        'admin'
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });
      return res.json(accessToken);
    } catch (error) {
      return res.json(error);
    }
  }

  @Get('refresh-accesstoken')
  async refreshAccessToken(@Req() req, @Res() res: Response): Promise<any> {
    const refreshToken = req.cookies?.refreshToken;
    return res.json(await this.authService.refreshAccessToken(refreshToken));
  }

  @Get('logout')
  async logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.json(await this.authService.logout(refreshToken));
  }
}
