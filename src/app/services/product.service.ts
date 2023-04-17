import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, map, tap} from 'rxjs';
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
	category_id?: number;
	category?: CategoryModel;
	createdA: string;
	updatedAt: string;
	reviews?: ReviewModel[];
}
export interface CategoryModel {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}
export interface ReviewModel {
	id: number;
	rating: number;
	description: string;
	createdAt: string;
	updatedAt: string;
	product_id?: number;
}

@Injectable({
	providedIn: 'root',
})
export class ProductService {
	private cartTotal$ = new BehaviorSubject<number>(0);
	constructor(private http: HttpClient) {
		this.loadCart();
		let cartItems = JSON.parse(localStorage.getItem('cart_items') as any) || [];
		this.cartTotal$.next(cartItems.length);
	}

	cartCount$ = this.cartTotal$.asObservable();
	cartList: any[] = [];

	getAllProducts() {
		return this.http.get(`${environment.apiUrl}/product`).pipe(
			map((res: any) => res['data']),
			tap((products) => {
				products.forEach((product: ProductModel) => {
					return {...product, quantity: 0};
				});
			})
		);
	}

	getAllCategories() {
		return this.http.get(`${environment.apiUrl}/category`).pipe(map((res: any) => res['data']));
	}

	getByCategoriesId(catId: number) {
		return this.http.get(`${environment.apiUrl}/category/${catId}`).pipe(map((res: any) => res['data']));
	}

	searchProducts(term: string) {
		return this.http.get(`${environment.apiUrl}/product/search/${term}`).pipe(map((res: any) => res['data']));
	}

	// Cart Logic

	getCartList() {
		return this.cartList;
	}

	saveCart() {
		localStorage.setItem('cart_items', JSON.stringify(this.cartList));
	}

	addToCart(product: ProductModel) {
		let productInCart = this.cartList.find((p) => p.id === product.id);
		if (productInCart) {
			return;
		} else {
			productInCart = {...product, quantity: 1};
			this.cartList.push(productInCart);
			this.saveCart();
			this.cartTotal$.next(this.cartList.length);
		}
	}

	increaseCartQuantity() {
		this.cartTotal$.next(this.cartTotal$.value + 1);
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
			const productInCart = this.cartList[index];
			if (productInCart.quantity > 1) {
				productInCart.quantity -= 1;
			} else {
				this.cartList.splice(index, 1);
			}
			this.saveCart();
		}

		// update cart total
		this.cartTotal$.next(this.cartList.length);
	}

	clearProducts() {
		localStorage.clear();
	}
}
