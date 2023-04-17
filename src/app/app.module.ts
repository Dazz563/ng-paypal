import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
// Paypal Module
import {NgxPayPalModule} from 'ngx-paypal';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {ShopComponent} from './shop/shop.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import { ViewProductComponent } from './shop/view-product/view-product.component';

@NgModule({
	declarations: [AppComponent, ShoppingCartComponent, ShopComponent, ViewProductComponent],
	imports: [
		BrowserModule, //
		AppRoutingModule,
		NgxPayPalModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		SharedModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
