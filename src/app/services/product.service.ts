import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, tap} from 'rxjs';
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
	constructor(private http: HttpClient) {}

	cartCount$ = this.cartTotal$.asObservable();
	cartList: any[] = [];

	getAllProducts() {
		return this.http.get(`${environment.apiUrl}/product`).pipe(
			map((res: any) => res['data']),
			tap((products) => {
				products.forEach((product: ProductModel) => {
					return {...product, quantity: 0};
				});
			}),
			catchError((err) => {
				if (err.error.message === 'Invalid token') {
					throw new Error('Invalid token');
				}
				throw new Error(err);
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
}
