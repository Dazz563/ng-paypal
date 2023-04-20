import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import {environment} from 'src/environments/environment.development';

export interface AuthCredentails {
	email: string;
	password: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private tokenSubject$ = new BehaviorSubject<string>('');
	token$ = this.tokenSubject$.asObservable();

	constructor(private http: HttpClient) {}

	login(creds: AuthCredentails) {
		return this.http
			.post<any>(`${environment.apiUrl}/auth/login`, creds, {withCredentials: true})
			.pipe(
				map((res: any) => res['accessToken']),
				tap((token) => {
					localStorage.setItem('jwt_token', token);
				})
			)
			.subscribe({
				next: (accessToken: string) => {
					this.tokenSubject$.next(accessToken);
				},
				error: (err) => {
					console.log(err);
				},
			});
	}

	refreshToken() {
		this.http.get(`${environment.apiUrl}/auth/refresh-token`, {withCredentials: true}).subscribe({
			next: (res: any) => {
				console.log('token on refresh', res);
				localStorage.setItem('jwt_token', res);
				this.tokenSubject$.next(res);
			},
			error: (err) => {
				console.log(err);
			},
		});
	}
}
