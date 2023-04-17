import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ProductModel} from 'src/app/services/product.service';

@Component({
	selector: 'app-view-product',
	templateUrl: './view-product.component.html',
	styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: ProductModel, //
		private modalRef: MatDialogRef<ViewProductComponent>
	) {}
	ngOnInit(): void {
		console.log('data', this.data);
	}
}

export const viewProductDialog = (dialog: MatDialog, data: any, action: string) => {
	const config = new MatDialogConfig();

	config.autoFocus = false;
	config.hasBackdrop = true;
	config.width = '600px';
	// config.maxHeight = '600px';

	config.data = {
		...data,
		action,
	};

	const modalRef = dialog.open(ViewProductComponent, config);
	return modalRef.afterClosed();
};

/**
 * We need to decide on update and delete modals once the users are created
 */

// export const openGroupDeleteModal = (dialog: MatDialog, data: any, action: string) => {
// 	const config = new MatDialogConfig();

// 	config.autoFocus = false;
// 	config.hasBackdrop = true;
// 	config.width = '600px';
// 	config.maxHeight = '600px';

// 	config.data = {
// 		...data,
// 		action,
// 	};

// 	const modalRef = dialog.open(ViewProductComponent, config);
// 	return modalRef.afterClosed();
// };
