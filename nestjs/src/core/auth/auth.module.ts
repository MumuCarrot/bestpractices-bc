import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordUtil } from '../../common/utils/password.util';
import { UserRepository } from '../database/repos/user.repo';
import { JwtUtil } from '../../common/utils/jwt.util';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordUtil, UserRepository, JwtUtil],
  exports: [AuthService],
})
export class AuthModule {}