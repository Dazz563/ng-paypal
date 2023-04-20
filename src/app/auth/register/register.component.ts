import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
	@Output() changeAuthStateEvent = new EventEmitter<void>();

	registerForm: FormGroup = new FormGroup({
		username: new FormControl('', [Validators.required]),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	changeAuthState() {
		this.changeAuthStateEvent.emit();
	}

	onRegister() {
		console.log(this.registerForm.value);
	}
}
