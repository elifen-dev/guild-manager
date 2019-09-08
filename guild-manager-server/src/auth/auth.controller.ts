import { BadRequestException, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService, IDiscordTokenResponse } from './auth.service';
import { TOKEN_COOKIE_NAME } from '../../environment';

@Controller('api/auth')
@ApiUseTags('Auth')
export class AuthController {

	constructor(private authService: AuthService) {

	}

	@Get('/discord/redirect')
	async redirectToDiscord(@Res() response: Response): Promise<void> {
		const redirectUrl: string = this.authService.getDiscordAuthUrl();
		return response.redirect(redirectUrl);
	}

	@Get('/discord/login')
	async getToken(@Query('code') code: string, @Res() response: Response): Promise<void> {
		if (!code) {
			throw new BadRequestException('Discord code is missing.');
		}
		const discordResponse: IDiscordTokenResponse = await this.authService.getDiscordToken(code);

		// Store the retrieved token into a cookie.
		const token: string = discordResponse.access_token;
		response.cookie(TOKEN_COOKIE_NAME, token);

		// Redirect to the application home.
		return response.redirect('/');
	}
}
