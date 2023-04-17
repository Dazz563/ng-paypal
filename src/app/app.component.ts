import {Component, OnInit} from '@angular/core';
import {ProductService} from './services/product.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	cardCount = 0;
	constructor(public productService: ProductService) {}
	ngOnInit(): void {
		this.productService.cartCount$.subscribe((res) => {
			console.log(res);
			this.cardCount = res;
		});
	}
}
