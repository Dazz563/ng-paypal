import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const idToken = localStorage.getItem('jwt_token');

		if (idToken) {
			const cloned = req.clone({
				headers: req.headers.set('Authorization', 'Bearer ' + idToken),
			});

			return next.handle(cloned);
		} else {
			return next.handle(req);
		}
	}
}
