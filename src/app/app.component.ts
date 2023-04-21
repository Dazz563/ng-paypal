import {Component, OnInit} from '@angular/core';
import {ProductService} from './services/product.service';
import {AuthService} from './services/auth.service';
import {OrdersService} from './services/orders.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	constructor(
		public productService: ProductService, //
		public authService: AuthService,
		public orderService: OrdersService
	) {}

	ngOnInit(): void {}

	logout() {
		this.authService.logout();
	}
}
