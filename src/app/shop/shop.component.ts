import {Component, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {CategoryModel, ProductModel, ProductService} from '../services/product.service';
import {Observable, debounceTime, distinctUntilChanged, fromEvent, map, switchMap} from 'rxjs';
import {viewProductDialog} from './view-product/view-product.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, AfterViewInit {
	products: ProductModel[] = [];
	categories$!: Observable<CategoryModel[]>;

	// search input
	@ViewChild('searchInput') searchInput!: ElementRef;

	constructor(
		private productService: ProductService, //
		private modal: MatDialog
	) {}

	ngOnInit(): void {
		this.getProducts();
		this.categories$ = this.productService.getAllCategories();
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
			// this.cartList = [...this.productService.getCartList()];
			// this.productService.increaseCartQuantity();
		}
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
}
