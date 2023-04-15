import {Component, OnInit} from '@angular/core';
import {IPayPalConfig, ICreateOrderRequest} from 'ngx-paypal'; // Import the necessary PayPal interfaces from ngx-paypal
import {environment} from 'src/environments/environment.development'; // Import the environment configuration
import {ProductModel} from '../services/product.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
	public payPalConfig?: IPayPalConfig; // Define a public property to store the PayPal configuration
	showSuccess = false; // Define a boolean property to track the success state of the checkout
	value = JSON.parse(localStorage.getItem('cart_total') as any) || []; // Define a value property that will come from the cart or order
	items: ProductModel[] = JSON.parse(localStorage.getItem('cart_items') as any) || []; // Define a value property that will come from the cart or order
	isLoading = true;

	constructor(private router: Router) {}
	ngOnInit(): void {
		setTimeout(() => {
			this.initConfig(); // Call the initConfig method to set up the PayPal configuration
			this.isLoading = false;
		}, 1000);
		console.log(this.items);
	}

	private initConfig(): void {
		// Define the PayPal configuration
		this.payPalConfig = {
			currency: 'USD', // Set the currency to USD
			clientId: `${environment.CLIENT_ID}`, // Set the client ID to the value from the environment configuration
			createOrderOnClient: (data) =>
				<ICreateOrderRequest>{
					// Define the createOrderOnClient callback function to create a PayPal order
					intent: 'CAPTURE', // Set the intent to capture the payment
					purchase_units: [
						{
							amount: {
								currency_code: 'USD', // Set the currency code to USD
								value: `${this.value}`, // Set the value of the order to the value property defined above
								breakdown: {
									item_total: {
										currency_code: 'USD',
										value: `${this.value}`,
									},
								},
							},
							items: this.items.map((item) => {
								return {
									name: item.name,
									quantity: `${item.quantity}`, // MUST BE STRING
									category: data.type,
									unit_amount: {
										currency_code: 'USD',
										value: `${item.price}`, // MUST BE STRING
									},
								};
							}),
						},
					],
				},
			advanced: {
				commit: 'true', // Set the commit option to true to immediately capture the payment
			},
			style: {
				label: 'paypal',
				layout: 'vertical',
				color: 'silver',
				shape: 'pill',
			},
			onApprove: (data, actions) => {
				/**
				 * Captures the funds from the transaction and shows a message to the buyer to let them know the transaction is successful.
				 * The method is called after the buyer approves the transaction on paypal.com.
				 * Because this is a client-side call, PayPal calls the Orders API on your behalf, so you don't need to provide the headers and body.
				 */
				console.log('onApprove - transaction was approved, but not authorized', data, actions);
				actions.order.get().then((details: any) => {
					console.log('onApprove - you can get full order details inside onApprove: ', details);
				});
			},
			onClientAuthorization: (data) => {
				console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
				this.showSuccess = true; // Set the showSuccess property to true to indicate that the checkout was successful

				// Clear localstorage
				localStorage.removeItem('cart_items');
				localStorage.removeItem('cart_total');

				this.router.navigateByUrl('/shop');
			},
			onCancel: (data, actions) => {
				/**
				 * When a buyer cancels a payment, they typically return to the parent page.
				 * You can instead use the onCancel function to show a cancellation page or return to the shopping cart.
				 */
				console.log('OnCancel', data, actions);
			},
			onError: (err) => {
				// If an error prevents buyer checkout, alert the user that an error has occurred with the buttons using the onError callback
				console.log('OnError', err);
			},
			onClick: (data, actions) => {
				/**
				 * Called when the button first renders.
				 * You can use it for validations on your page if you are unable to do so prior to rendering.
				 * For example, enable buttons when form validation passes or disable if it fails
				 */
				console.log('onClick', data, actions);
			},
		};
	}
}
