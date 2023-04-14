import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShoppingCartComponent} from './shopping-cart/shopping-cart.component';
import {ShopComponent} from './shop/shop.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/shop',
		pathMatch: 'full',
	},
	{
		path: 'shop',
		component: ShopComponent,
	},
	{
		path: 'shopping-cart',
		component: ShoppingCartComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
