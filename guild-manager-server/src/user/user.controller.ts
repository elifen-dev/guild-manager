import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AbstractController } from '../generic/abstract-controller';
import { UserEntity } from './models/user.entity';
import { GmRequest } from '../generic/gm-request';

@Controller('api/user')
@ApiUseTags('User')
@UseGuards(AuthGuard)
export class UserController extends AbstractController<UserEntity, UserDto> {

	constructor(private userService: UserService) {
		super(userService);
	}

	@Get('authenticated')
	async getAuthenticatedUser(@Req() request: GmRequest): Promise<UserDto> {
		return await this.userService.getAuthenticatedUser(request.user);
	}
}
