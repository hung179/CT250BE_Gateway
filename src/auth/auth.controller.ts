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
import { RefreshTokenDto } from './dto/refresh-token.dto';
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
      return res.json({ success: true, data: accessToken });
    } catch (error) {
      return res.json({ success: false, error: error });
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
      return res.json({ success: true, data: accessToken });
    } catch (error) {
      return res.json({ success: false, error: error });
    }
  }

  @Get('refresh-accesstoken')
  async refreshAccessToken(@Req() req, @Res() res: Response): Promise<any> {
    const refreshToken = req.cookies?.refreshToken;
    return res.json(await this.authService.refreshAccessToken(refreshToken));
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res: Response) {
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.cookies?.refreshToken;

    return res.json(await this.authService.logout(accessToken, refreshToken));
  }
}
