import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, map, tap} from 'rxjs';
import {environment} from 'src/environments/environment.development';

export interface ProductModel {
	id: number;
	name: string;
	description: string;
	longDescription: string;
	price: number;
	quantity?: number;
	type: string;
	image: string;
}

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	constructor(private http: HttpClient) {}

	cartList: any[] = [];

	getAllProducts() {
		return this.http.get(`${environment.apiUrl}/product/all-products`).pipe(
			map((res: any) => res['data']),
			tap((products) => {
				products.forEach((product: ProductModel) => {
					return {...product, quantity: 0};
				});
			})
		);
	}

	getCartList() {
		return this.cartList;
	}

	saveCart() {
		localStorage.setItem('cart_items', JSON.stringify(this.cartList));
	}

	addToCart(product: any) {
		this.cartList.push(product);
		this.saveCart();
	}

	loadCart() {
		this.cartList = JSON.parse(localStorage.getItem('cart_items') as any) || [];
	}

	productInCart(product: any) {
		return this.cartList.find((p) => p.id === product.id) !== undefined;
	}

	removeItemFromCart(product: ProductModel) {
		const index = this.cartList.findIndex((p) => p.id === product.id);

		//check if product is in cart
		if (index > -1) {
			this.cartList.splice(index, 1);
			this.saveCart();
		}
	}

	clearProducts() {
		localStorage.clear();
	}
}
