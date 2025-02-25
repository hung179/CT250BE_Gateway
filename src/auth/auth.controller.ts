import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CustomerLocalAuthGuard } from './guards/customer_local-auth.guard';
import { AdminLocalAuthGuard } from './guards/admin_local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminOnlyGuard } from './guards/admin-only.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('customer-login')
  @UseGuards(CustomerLocalAuthGuard)
  async customerLogin(@Req() req) {
    return this.authService.login(req.user, 'customer');
  }

  @Post('admin-login')
  @UseGuards(AdminLocalAuthGuard)
  async adminLogin(@Req() req) {
    return this.authService.login(req.user, 'admin');
  }

  @Post('refresh-accesstoken')
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<any> {
    return await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req,
    @Body('refreshToken') refreshTokenDto: RefreshTokenDto
  ) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return this.authService.logout(
      req.user.userId,
      accessToken,
      refreshTokenDto.refreshToken
    );
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, AdminOnlyGuard)
  adminOnly(@Req() req) {
    return { message: 'Welcome Admin', user: req.user };
  }
}
