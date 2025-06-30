import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'emailOrUsername', // 支持邮箱或用户名登录
      passwordField: 'password',
    });
  }

  async validate(emailOrUsername: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(emailOrUsername, password);
    
    if (!user) {
      throw new UnauthorizedException('邮箱/用户名或密码错误');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('账户已被禁用');
    }

    return user;
  }
}
