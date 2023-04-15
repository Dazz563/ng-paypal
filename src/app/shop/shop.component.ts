import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CategoryModel, ProductModel, ProductService} from '../services/product.service';
import {Observable, debounceTime, distinctUntilChanged, fromEvent, map, switchMap} from 'rxjs';

@Component({
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, AfterViewInit {
	// products$!: Observable<ProductModel[]>;
	products: ProductModel[] = [];
	categories$!: Observable<CategoryModel[]>;
	cartList: ProductModel[] = [];
	subTotal!: number;

	// search input
	@ViewChild('searchInput') searchInput!: ElementRef;

	constructor(private productService: ProductService) {}

	ngOnInit(): void {
		this.getProducts();
		this.categories$ = this.productService.getAllCategories();
		this.productService.getByCategoriesId(2).subscribe((res) => console.log(res));

		// Get the cart list from the product service
		this.productService.loadCart();
		this.cartList = this.productService.getCartList();
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
		this.productService.getAllProducts().subscribe((res) => {
			this.products = res;
			console.log(res);
		});
	}

	filterByCategory(catId: number) {
		this.productService.getByCategoriesId(catId).subscribe((res) => {
			this.products = res;
			console.log(res);
		});
	}

	// Add a product to the cart
	addToCart(product: ProductModel) {
		if (!this.productService.productInCart(product)) {
			product.quantity = 1;
			this.productService.addToCart(product);
			this.cartList = [...this.productService.getCartList()];
			this.subTotal = product.price;
		}
	}

	// Update the quantity of a product in the cart
	changeQuantity(item: ProductModel, idx: number) {
		const qty = item.quantity;
		const amt = item.price;

		this.subTotal = amt * qty!;

		this.productService.saveCart();
	}

	// Remove a product from the cart
	removeFromCart(item: ProductModel) {
		this.productService.removeItemFromCart(item);
		this.cartList = this.productService.getCartList();
	}

	get calcTotal() {
		return this.cartList.reduce(
			(sum, item) => ({
				quantity: 1,
				price: sum.price + (item?.quantity || 0) * (item?.price || 0),
			}),
			{quantity: 1, price: 0}
		).price;
	}

	checkout() {
		localStorage.setItem('cart_total', JSON.stringify(this.calcTotal));
	}

	isCartEmpty(): boolean {
		return this.cartList.length === 0;
	}
}
