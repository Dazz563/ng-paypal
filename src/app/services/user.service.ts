import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from 'rxjs';
import {environment} from 'src/environments/environment.development';

export interface UserModel {
	id: number;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private userSubject$ = new BehaviorSubject<UserModel | null>(null);
	user$ = this.userSubject$.asObservable();

	constructor(
		private http: HttpClient //
	) {}

	setUser(user: UserModel | null) {
		this.userSubject$.next(user);
	}

	getUser(id: number) {
		return this.http.get<UserModel>(`${environment.apiUrl}/user/${id}`).pipe(
			map((res: any) => res['data']),
			tap((user: UserModel) => {
				this.setUser(user);
			})
		);
	}

	updateUser(id: number, user: UserModel) {
		return this.http.put(`${environment.apiUrl}/user/${id}`, user);
	}

	deleteUser(id: number) {
		return this.http.delete(`${environment.apiUrl}/user/${id}`);
	}
}
