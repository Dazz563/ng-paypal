import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, catchError, switchMap} from 'rxjs';
import {environment} from 'src/environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
	refresh = false;
	constructor(
		private http: HttpClient //
	) {}

	// Implement the intercept method required by the HttpInterceptor interface
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Get the JWT token from local storage
		const token = localStorage.getItem('jwt_token');

		// Clone the request and add the token to the headers
		const req = request.clone({
			headers: request.headers.set('Authorization', 'Bearer ' + token),
		});

		// Send the request to the next interceptor or to the backend
		return next.handle(req).pipe(
			// Catch any errors that occur during the request
			catchError((err: HttpErrorResponse) => {
				// If the error is a 401 or 403 error and a token refresh is not already in progress
				if ((err.status === 401 && !this.refresh) || (err.status === 403 && !this.refresh)) {
					// Set the refresh flag to true
					this.refresh = true;
					console.log('Token expired. Attempting to refresh token...');

					// Call the refresh-token endpoint to get a new token
					return this.http.get(`${environment.apiUrl}/auth/refresh-token`, {withCredentials: true}).pipe(
						// If the new token is received, use it to create a new request and send it
						switchMap((newToken: any) => {
							// Save the new token in local storage
							localStorage.setItem('jwt_token', newToken);

							// Create a new request with the new token and send it
							const reqWithNewToken = req.clone({
								headers: req.headers.set('Authorization', 'Bearer ' + newToken),
							});

							return next.handle(reqWithNewToken);
						})
					);
				}

				// If the error is not a 401 or 403 error or a token refresh is already in progress,
				// reset the refresh flag and throw the error
				this.refresh = false;
				throw new Error(err.message);
			})
		);
	}
}
