import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService, IDiscordUser } from '../auth.service';
import { ADMIN_ONLY_METADATA_KEY } from '../decorators/admin-only.decorator';
import { SUPER_ADMIN_DISCORD_ID } from '../../../environment';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private reflector: Reflector) {

	}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		// Validate the authentication.
		return this.authService.validateRequest(request).then((validated) => {
			if (validated) {
				// If the user is valid
				const user: IDiscordUser = request.user;

				// Check if the handler is for administrators only.
				const isAdminOnly = this.reflector.get<string[]>(ADMIN_ONLY_METADATA_KEY, context.getHandler());
				if (isAdminOnly) {
					return user && user.id === SUPER_ADMIN_DISCORD_ID;
				} else {
					return true;
				}
			} else {
				return false;
			}
		});
	}
}
