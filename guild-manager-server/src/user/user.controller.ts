import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GmRequest } from '../auth/auth.service';

@Controller('api/user')
@ApiUseTags('User')
@UseGuards(AuthGuard)
export class UserController {

	constructor(private userService: UserService) {

	}

	@Get('authenticated')
	async getAuthenticatedUser(@Req() request: GmRequest): Promise<UserDto> {
		return await this.userService.getAuthenticatedUser(request.user);
	}
}
