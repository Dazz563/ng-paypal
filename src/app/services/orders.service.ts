import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.development';
import {ProductModel} from './product.service';
import {BehaviorSubject, map, of, switchMap, tap} from 'rxjs';
import {UserModel, UserService} from './user.service';

export interface OrderModel {
	id: number;
	product_id: number;
	user_id: number;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
	product: ProductModel;
}

@Injectable({
	providedIn: 'root',
})
export class OrdersService {
	private orderSubject$ = new BehaviorSubject<OrderModel[]>([]);
	orders$ = this.orderSubject$.asObservable();

	constructor(
		private http: HttpClient, //
		private userService: UserService
	) {
		this.userService.user$
			.pipe(
				switchMap((user: UserModel | null) => {
					if (!user) {
						return [];
					}
					return this.http.get<OrderModel[]>(`${environment.apiUrl}/order/${user.id}`).pipe(map((res: any) => res['data']));
				})
			)
			.subscribe((orders: OrderModel[]) => {
				console.log('orders: ', orders);

				this.orderSubject$.next(orders);
			});
	}

	addOrder(orders: OrderModel[], order: any) {
		console.log('new orders: ', order);
		this.http
			.post(`${environment.apiUrl}/order`, order)
			.pipe(map((res: any) => res['data']))
			.subscribe({
				next: (res: any) => {
					console.log('res: ', res);
					this.orderSubject$.next([...orders, res]);
					// after save to DB
					console.log('orders subject: ', this.orderSubject$.getValue());
				},
				error: (err) => {},
			});
	}

	removeOrder(id: number) {
		this.http.delete(`${environment.apiUrl}/order/${id}`).subscribe({
			next: (res: any) => {
				this.orderSubject$.next(this.orderSubject$.value.filter((order) => order.id !== id));
			},
			error: (err) => {},
		});
	}

	updateOrderQuantity(orders: OrderModel[], orderUpdated: OrderModel) {
		this.orderSubject$.next(orders);

		this.http.patch(`${environment.apiUrl}/order/${orderUpdated.id}`, orderUpdated).subscribe({
			next: (res: any) => {
				// console.log('res: ', res);
			},
			error: (err) => {},
		});
	}

	productExistsInOrders(product: ProductModel, orders: OrderModel[]) {
		return orders.find((order) => order.product.id === product.id) !== undefined;
	}
}
