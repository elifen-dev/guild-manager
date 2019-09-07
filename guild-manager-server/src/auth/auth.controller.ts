import { BadRequestException, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../../environment';
import { AuthService, IDiscordTokenResponse } from './auth.service';

@Controller('api/auth')
@ApiUseTags('Auth')
export class AuthController {

	constructor(private authService: AuthService) {

	}

	@Get('/discord/redirect')
	async redirectToDiscord(@Res() response: Response): Promise<void> {
		// tslint:disable-next-line:max-line-length
		const redirectUrl: string = `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${REDIRECT_URI}`;
		return response.redirect(redirectUrl);
	}

	@Get('/discord/login')
	async getToken(@Query('code') code: string, @Res() response: Response): Promise<void> {
		if (!code) {
			throw new BadRequestException('Discord code is missing.');
		}
		const discordResponse: IDiscordTokenResponse = await this.authService.getDiscordToken(code);
		const token: string = discordResponse.access_token;
		return response.redirect(`/?token=${token}`);
	}
}
