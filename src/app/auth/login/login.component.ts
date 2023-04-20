import {Component, EventEmitter, Output} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {AuthService} from 'src/app/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
	constructor(
		private authService: AuthService //
	) {}

	@Output() changeAuthStateEvent = new EventEmitter<void>();

	loginForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	changeAuthState() {
		this.changeAuthStateEvent.emit();
	}

	onLogin() {
		console.log(this.loginForm.value);
		this.authService.login(this.loginForm.value);
	}
}
