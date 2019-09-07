import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private httpClient: HttpClient) {

	}

	async discordLogin(): Promise<void> {
		try {
			return await this.httpClient.get<void>('/api/auth/discord-login').toPromise();
		} catch (exception) {
			console.log('error while login with discord.', exception);
		}
	}
}
