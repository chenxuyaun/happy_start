import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsIn,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '用户名只能包含字母、数字和下划线',
  })
  username?: string;

  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @IsString()
  @MinLength(8, { message: '密码长度至少8位' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: '密码必须包含大小写字母、数字和特殊字符',
  })
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  first_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @IsOptional()
  @IsDateString({}, { message: '请输入有效的日期格式' })
  date_of_birth?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other', 'prefer_not_to_say'], {
    message: '性别选项无效',
  })
  gender?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, {
    message: '请输入有效的手机号码',
  })
  phone_number?: string;

  @IsBoolean({ message: '必须同意隐私政策' })
  @IsNotEmpty()
  privacy_consent: boolean;

  @IsBoolean({ message: '必须同意服务条款' })
  @IsNotEmpty()
  terms_accepted: boolean;
}
