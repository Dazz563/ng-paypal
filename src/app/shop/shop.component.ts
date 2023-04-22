import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CategoryModel, ProductModel, ProductService} from '../services/product.service';
import {Observable, debounceTime, distinctUntilChanged, fromEvent, switchMap, take} from 'rxjs';
import {viewProductDialog} from './view-product/view-product.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {OrdersService} from '../services/orders.service';

@Component({
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, AfterViewInit {
	products: ProductModel[] = [];
	categories$!: Observable<CategoryModel[]>;

	// auth
	isLogin = true;

	// search input
	@ViewChild('searchInput') searchInput!: ElementRef;

	constructor(
		private productService: ProductService, //
		public authService: AuthService,
		private userservice: UserService,
		private orderService: OrdersService,
		private modal: MatDialog
	) {}

	ngOnInit(): void {
		this.getProducts();
		// this.getUserOrders();
		this.categories$ = this.productService.getAllCategories();
		// Below is just testing will need updating for all products
		this.productService.getByCategoriesId(2).subscribe((res) => console.log(res));
	}

	// search debounces to avoid rapid calls to the server
	ngAfterViewInit(): void {
		fromEvent<any>(this.searchInput.nativeElement, 'keyup')
			.pipe(
				debounceTime(500),
				distinctUntilChanged(),
				switchMap((event) => {
					const term = event.target.value.trim();
					if (term === '') {
						return this.productService.getAllProducts();
					} else {
						return this.productService.searchProducts(term);
					}
				})
			)
			.subscribe((products: any) => {
				console.log('products search res', products);

				this.products = products;
			});
	}

	getProducts() {
		this.productService.getAllProducts().subscribe({
			next: (res) => {
				this.products = res;
				// console.log(res);
			},
			error: (err) => {},
		});
	}

	filterByCategory(catId: number) {
		this.productService.getByCategoriesId(catId).subscribe((res) => {
			this.products = res;
			console.log(res);
		});
	}

	// UPDATE CODE BELOW TO USE ORDER SERVICE
	// Add a product to the cart
	addItemToOrder(product: ProductModel) {
		this.orderService.orders$.pipe(take(1)).subscribe((orders) => {
			console.log('orders', orders);

			const existingOrder = orders.find((order) => order.product.id === product.id);
			if (existingOrder) {
				// Product already exists in the orders
				return;
			} else {
				// Product doesn't exist in the orders
				this.userservice.user$.pipe(take(1)).subscribe((user) => {
					if (user) {
						const newOrder = {productId: product.id, quantity: 1, userId: user.id};
						this.orderService.addOrder(orders, newOrder);
					}
				});
			}
		});
	}

	viewProduct(product: ProductModel) {
		viewProductDialog(this.modal, product, 'view').subscribe({
			next: (dialogRes) => {
				if (dialogRes) {
				}
			},
			error: (err) => {
				console.log(err);
			},
		});
	}

	onAuthStateChanged() {
		this.isLogin = !this.isLogin;
	}
}
