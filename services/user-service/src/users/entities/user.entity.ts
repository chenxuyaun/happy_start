import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @Column({ type: 'citext', unique: true, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  password_hash: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  phone_number: string;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: string;

  @Column({ type: 'boolean', default: false })
  privacy_consent: boolean;

  @Column({ type: 'boolean', default: false })
  terms_accepted: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  last_login: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  encrypted_personal_data: any;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @Column({ type: 'uuid', nullable: true })
  updated_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  data_retention_until: Date;

  @Column({ type: 'boolean', default: false })
  anonymization_requested: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  anonymization_date: Date;

  // 密码相关方法
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password_hash && !this.password_hash.startsWith('$2')) {
      // 只有当密码不是已经哈希过的时候才进行哈希
      this.password_hash = await bcrypt.hash(this.password_hash, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password_hash) return false;
    return bcrypt.compare(password, this.password_hash);
  }

  // 获取用户全名
  get fullName(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    }
    return this.first_name || this.last_name || this.username || this.email;
  }

  // 检查用户是否完整填写了信息
  get isProfileComplete(): boolean {
    return !!(
      this.email &&
      this.first_name &&
      this.last_name &&
      this.privacy_consent &&
      this.terms_accepted
    );
  }

  // 序列化时排除敏感信息
  toJSON() {
    const { password_hash, encrypted_personal_data, ...result } = this;
    return result;
  }
}
