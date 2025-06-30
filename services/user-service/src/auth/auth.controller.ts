import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * 创建匿名用户（用于用户体验产品）
   */
  @Post('anonymous')
  @HttpCode(HttpStatus.CREATED)
  async createAnonymous(): Promise<AuthResponse> {
    return this.authService.createAnonymousUser();
  }

  /**
   * 获取当前用户信息
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<Partial<User>> {
    const { password_hash, encrypted_personal_data, ...userInfo } = req.user;
    return userInfo;
  }

  /**
   * 刷新访问令牌
   */
  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  async refresh(@Request() req): Promise<AuthResponse> {
    return this.authService.refreshToken(req.user);
  }

  /**
   * 用户登出（客户端处理，服务端记录）
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req): Promise<{ message: string }> {
    // 在实际应用中，可以在这里添加令牌黑名单逻辑
    // 或者记录登出日志
    return { message: '登出成功' };
  }

  /**
   * 验证令牌是否有效
   */
  @Get('verify')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Request() req): Promise<{ valid: boolean; user: Partial<User> }> {
    const { password_hash, encrypted_personal_data, ...userInfo } = req.user;
    return {
      valid: true,
      user: userInfo,
    };
  }
}
