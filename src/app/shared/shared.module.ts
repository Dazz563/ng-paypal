import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@NgModule({
	declarations: [],
	imports: [
		CommonModule, //
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
	],
	exports: [
		MatButtonModule, //
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
	],
})
export class SharedModule {}
