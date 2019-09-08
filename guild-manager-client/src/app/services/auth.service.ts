import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../modules/user/user.dto';
import {plainToClass} from 'class-transformer';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private httpClient: HttpClient) {

	}

	/**
	 * Get currently authenticated user.
	 */
	async getCurrentUser(): Promise<User> {
		try {
			const json = await this.httpClient.get<object>('api/user/authenticated').toPromise();
			return plainToClass(User, json);
		} catch (exception) {
			console.error('Authenticated user not found.', exception);
			return null;
		}
	}
}
