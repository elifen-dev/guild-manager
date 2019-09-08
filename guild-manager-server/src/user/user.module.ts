import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([UserEntity])],
	providers: [UserService],
	controllers: [UserController]
})
export class UserModule {
}
