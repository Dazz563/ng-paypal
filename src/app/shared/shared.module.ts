import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
	declarations: [],
	imports: [
		CommonModule, //
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatToolbarModule,
		MatIconModule,
		MatSelectModule,
	],
	exports: [
		MatButtonModule, //
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatToolbarModule,
		MatIconModule,
		MatSelectModule,
	],
})
export class SharedModule {}
