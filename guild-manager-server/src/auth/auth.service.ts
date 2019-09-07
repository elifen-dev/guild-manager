import { HttpService, Injectable } from '@nestjs/common';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../../environment';
import * as winston from 'winston';
import * as btoa from 'btoa';

export interface IDiscordTokenResponse {
	access_token: string;
	token_type: string;
	epires_in: number;
	refresh_token: string;
	scope: string;
}

@Injectable()
export class AuthService {
	constructor(private http: HttpService) {

	}

	/**
	 * Use the code retrieve after login to get an auth token.
	 */
	async getDiscordToken(code: string): Promise<IDiscordTokenResponse> {
		const credentials: string = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
		const url: string = `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`;
		try {
			const response = await this.http.post<IDiscordTokenResponse>(url, null, {headers: {Authorization: `Basic ${credentials}`}}).toPromise();
			return response.data;
		} catch (exception) {
			winston.error('Error in Auth service: Could not retrieve discord token.');
		}
	}
}
