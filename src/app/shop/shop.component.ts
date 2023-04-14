import {Component, OnInit} from '@angular/core';
import {ProductModel, ProductService} from '../services/product.service';
import {Observable} from 'rxjs';

@Component({
	selector: 'app-shop',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
	products$!: Observable<ProductModel[]>;
	cartList: ProductModel[] = [];
	subTotal!: number;

	constructor(private productService: ProductService) {}

	ngOnInit(): void {
		this.products$ = this.productService.getAllProducts();

		// Get the cart list from the product service
		this.productService.loadCart();
		this.cartList = this.productService.getCartList();
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
