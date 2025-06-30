import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  // 验证至少提供邮箱或用户名其中之一
  validate() {
    if (!this.email && !this.username) {
      throw new Error('请提供邮箱或用户名');
    }
    return true;
  }
}
