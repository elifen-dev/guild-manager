import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {User} from './modules/user/user.dto';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'guild-manager-client';

	user: User;

	avatarUrl: string;

	constructor(private authService: AuthService, private router: Router) {

	}

	ngOnInit(): void {
		this.authService.getCurrentUser().then((user) => {
			console.log('current user found', user);
			if (user) {
				this.user = user;
				this.avatarUrl = 'https://cdn.discordapp.com/avatars/' + user.discordId + '/' + user.avatar + '.png';
			}
		});
	}
}
