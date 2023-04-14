import {Component, OnInit} from '@angular/core';
import {IPayPalConfig, ICreateOrderRequest} from 'ngx-paypal'; // Import the necessary PayPal interfaces from ngx-paypal
import {environment} from 'src/environments/environment.development'; // Import the environment configuration

@Component({
	selector: 'app-shopping-cart',
	templateUrl: './shopping-cart.component.html',
	styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
	public payPalConfig?: IPayPalConfig; // Define a public property to store the PayPal configuration
	showSuccess = false; // Define a boolean property to track the success state of the checkout
	value = 9.99; // Define a value property that will come from the cart or order

	constructor() {}
	ngOnInit(): void {
		this.initConfig(); // Call the initConfig method to set up the PayPal configuration
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
							items: [
								{
									name: 'Enterprise Subscription', // Set the name of the item to Enterprise Subscription
									quantity: '1',
									category: 'DIGITAL_GOODS',
									unit_amount: {
										currency_code: 'USD',
										value: `${this.value}`,
									},
								},
							],
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
			},
			onApprove: (data, actions) => {
				console.log('onApprove - transaction was approved, but not authorized', data, actions);
				actions.order.get().then((details: any) => {
					console.log('onApprove - you can get full order details inside onApprove: ', details);
				});
			},
			onClientAuthorization: (data) => {
				console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
				this.showSuccess = true; // Set the showSuccess property to true to indicate that the checkout was successful
			},
			onCancel: (data, actions) => {
				console.log('OnCancel', data, actions);
			},
			onError: (err) => {
				console.log('OnError', err);
			},
			onClick: (data, actions) => {
				console.log('onClick', data, actions);
			},
		};
	}
}
