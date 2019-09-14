import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller('api/app')
@UseGuards(AuthGuard)
export class AppController {
	constructor(private readonly appService: AppService) {
	}

	@Get('hello')
	getHello(): string {
		return this.appService.getHello();
	}

}
