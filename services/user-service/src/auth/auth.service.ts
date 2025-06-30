import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

export interface AuthResponse {
  access_token: string;
  user: Partial<User>;
  expires_in: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, username, password, ...userData } = registerDto;

    // 检查邮箱是否已存在
    if (email) {
      const existingEmailUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingEmailUser) {
        throw new ConflictException('该邮箱已被注册');
      }
    }

    // 检查用户名是否已存在
    if (username) {
      const existingUsernameUser = await this.userRepository.findOne({
        where: { username },
      });
      if (existingUsernameUser) {
        throw new ConflictException('该用户名已被使用');
      }
    }

    // 验证必要条件
    if (!registerDto.privacy_consent) {
      throw new BadRequestException('必须同意隐私政策');
    }

    if (!registerDto.terms_accepted) {
      throw new BadRequestException('必须同意服务条款');
    }

    // 创建新用户
    const user = this.userRepository.create({
      email,
      username,
      password_hash: password, // 将在 @BeforeInsert 中自动哈希
      ...userData,
    });

    try {
      const savedUser = await this.userRepository.save(user);
      return this.generateTokenResponse(savedUser);
    } catch (error) {
      throw new ConflictException('用户创建失败，请检查输入信息');
    }
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // 验证至少提供邮箱或用户名其中之一
    if (!loginDto.email && !loginDto.username) {
      throw new BadRequestException('请提供邮箱或用户名');
    }

    const user = await this.validateUser(
      loginDto.email || loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('邮箱/用户名或密码错误');
    }

    return this.generateTokenResponse(user);
  }

  /**
   * 验证用户凭证
   */
  async validateUser(emailOrUsername: string, password: string): Promise<User | null> {
    // 尝试通过邮箱或用户名查找用户
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :emailOrUsername OR user.username = :emailOrUsername', {
        emailOrUsername,
      })
      .addSelect('user.password_hash') // 明确选择密码字段
      .getOne();

    if (!user) {
      return null;
    }

    // 验证密码
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return null;
    }

    // 更新最后登录时间
    user.last_login = new Date();
    await this.userRepository.save(user);

    return user;
  }

  /**
   * 生成JWT令牌响应
   */
  private async generateTokenResponse(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = 24 * 60 * 60; // 24小时

    // 返回用户信息（排除敏感信息）
    const { password_hash, encrypted_personal_data, ...userInfo } = user;

    return {
      access_token,
      user: userInfo,
      expires_in,
    };
  }

  /**
   * 刷新令牌
   */
  async refreshToken(user: User): Promise<AuthResponse> {
    return this.generateTokenResponse(user);
  }

  /**
   * 验证令牌
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub, is_active: true },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * 创建匿名用户
   */
  async createAnonymousUser(): Promise<AuthResponse> {
    const anonymousUser = this.userRepository.create({
      is_anonymous: true,
      privacy_consent: true,
      terms_accepted: true,
      username: `anonymous_${Date.now()}`,
    });

    const savedUser = await this.userRepository.save(anonymousUser);
    return this.generateTokenResponse(savedUser);
  }
}
