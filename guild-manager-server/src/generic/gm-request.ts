import {Request} from 'express';
import {IDiscordUser} from '../auth/auth.service';

export interface GmRequest extends Request {
	user: IDiscordUser;
	roles: string[];
}
