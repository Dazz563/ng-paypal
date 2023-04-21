import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, map, tap} from 'rxjs';
import {environment} from 'src/environments/environment.development';
import {UserModel, UserService} from './user.service';

const USER_DATA = 'user_details';

export interface AuthCredentails {
	email: string;
	password: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	// private userSubject$ = new BehaviorSubject<UserModel | null>(null);
	// user$ = this.userSubject$.asObservable();

	isLoggedIn$: Observable<boolean>;
	isLoggedOut$: Observable<boolean>;

	constructor(
		private http: HttpClient, //
		private userService: UserService
	) {
		// observables set for gen. access & auth guard
		this.isLoggedIn$ = this.userService.user$.pipe(map((user) => !!user));
		this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

		// checking auth status from local storage
		const user = localStorage.getItem(USER_DATA);

		if (user && user != 'undefined') {
			this.userService.getUser(JSON.parse(user).id).subscribe({
				next: (user: UserModel) => {
					localStorage.setItem(USER_DATA, JSON.stringify(user));
				},
				error: (err) => {},
			});
		}
	}

	login(creds: AuthCredentails) {
		return this.http.post<any>(`${environment.apiUrl}/auth/login`, creds, {withCredentials: true}).subscribe({
			next: (res: any) => {
				// set token in local storage
				localStorage.setItem('jwt_token', res.accessToken);
				// set user in local storage
				this.userService.getUser(res.data.id).subscribe({
					next: (user: UserModel) => {
						console.log('get user res: ', user);

						localStorage.setItem(USER_DATA, JSON.stringify(user));
					},
					error: (err) => {},
				});
			},
			error: (err) => {
				console.log(err);
			},
		});
	}

	logout() {
		localStorage.removeItem('jwt_token');
		localStorage.removeItem(USER_DATA);
		this.userService.setUser(null);
		this.http.delete(`${environment.apiUrl}/auth/logout`, {withCredentials: true}).subscribe({
			next: (res: any) => {
				console.log('logout', res);
			},
			error: (err) => {
				console.log(err);
			},
		});
	}
}
