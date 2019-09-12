import { BadRequestException, HttpService, Injectable } from '@nestjs/common';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TOKEN_COOKIE_NAME } from '../../environment';
import * as winston from 'winston';
import * as btoa from 'btoa';
import {GmRequest} from '../generic/gm-request';

export interface IDiscordTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
}

export interface IDiscordUser {
	id: string;
	username: string;
	discriminator: string;
	avatar: string;
	verified: boolean;
	flags: number;
	premium_type: number;
}

@Injectable()
export class AuthService {

	/**
	 * Public Discord API.
	 */
	discordApi: string = 'https://discordapp.com/api/';

	constructor(private http: HttpService) {

	}

	/**
	 * Get the url to authenticate in discord.
	 */
	getDiscordAuthUrl(): string {
		return `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=guilds%20identify`;
	}

	/**
	 * Use the code retrieve after login to get an auth token.
	 */
	async getDiscordToken(code: string): Promise<IDiscordTokenResponse> {
		const credentials: string = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
		const url: string = `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`;
		try {
			const response = await this.http.post<IDiscordTokenResponse>(url, null, { headers: { Authorization: `Basic ${credentials}` } }).toPromise();
			return response.data;
		} catch (exception) {
			winston.error('Error in Auth service: Could not retrieve discord token.');
		}
	}

	/**
	 * Validate a request.
	 * @param request
	 */
	async validateRequest(request: GmRequest): Promise<boolean> {
		if (request.cookies && request.cookies[TOKEN_COOKIE_NAME]) {
			const token = request.cookies[TOKEN_COOKIE_NAME];

			// If this request succeed then the token is valid.
			const user: IDiscordUser = await this.retrieveDiscordUser(token);
			request.user = user;
			return user != null;
		}
		return false;
	}

	/**
	 * Retrieve a discord user.
	 * @param token
	 */
	async retrieveDiscordUser(token: string): Promise<IDiscordUser> {
		if (!token) {
			winston.error('Auth Service - retrieveDiscordUser: Missing token parameter.');
			throw new BadRequestException('No token provided.');
		}
		const url: string = this.discordApi + 'users/@me';
		try {
			const response = await this.http.get<IDiscordUser>(url, this.createAuthHeader(token)).toPromise();
			return response.data;
		} catch (exception) {
			winston.error('Failed to retrieve discord user, the provided token maybe invalid.');
			return null;
		}
	}

	/**
	 * Create authorization header from the token.
	 * @param token
	 */
	createAuthHeader(token: string): { headers: { [header: string]: string } } {
		return { headers: { Authorization: 'Bearer ' + token } };
	}
}
