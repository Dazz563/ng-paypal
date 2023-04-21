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
				this.orderSubject$.next(orders);
			});
	}

	getAllOrders() {}
}
