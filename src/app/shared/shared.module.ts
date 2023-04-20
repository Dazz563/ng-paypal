import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShortenPipe} from './shorten.pipe';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDialogModule} from '@angular/material/dialog';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
	declarations: [ShortenPipe],
	imports: [
		CommonModule, //
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatToolbarModule,
		MatIconModule,
		MatSelectModule,
		MatBadgeModule,
		MatDialogModule,
	],
	exports: [
		MatButtonModule, //
		ReactiveFormsModule,
		MatCardModule,
		MatInputModule,
		MatFormFieldModule,
		MatToolbarModule,
		MatIconModule,
		MatSelectModule,
		MatBadgeModule,
		MatDialogModule,
		ShortenPipe,
	],
})
export class SharedModule {}
