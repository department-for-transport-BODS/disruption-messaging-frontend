import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'table-action-buttons',
	template: `
		<div *ngIf="gridParent.selectedIndex == cell.rowIndex" class="table-action-buttons">
			<dm-icon-button
				 *ngIf="gridParent.showEditButton"
				btnId="edit-table-entry-{{ cell.rowIndex }}"
				type="button"
				(onClick)="onEdit($event)"
				appearance="minimal"
				icon="edit"
				accessibilityLabel="Edit"
			></dm-icon-button>
			<dm-icon-button
				btnId="remove-table-entry-{{ cell.rowIndex }}"
				type="button"
				(onClick)="onDelete($event)"
				appearance="minimal"
				icon="trash"
				accessibilityLabel="Delete"
			></dm-icon-button>
		</div>
	`,
	styles: []
})
export class TableButtonsParentComponent implements ICellRendererAngularComp {
	public gridParent: any = false;
	public cell: any;

	agInit(params: any): void {
		this.gridParent = params.context.gridParent;
		this.cell = {row: params.data, rowIndex: params.node.rowIndex};
	}

	refresh(): boolean {
		return true;
	}

	public onEdit(event): void {
		event.stopPropagation();
		this.gridParent.resetSelectedIndex();
		this.gridParent.edit.emit(this.cell.row);
	}

	public onDelete(event): void {
		event.stopPropagation();
		this.gridParent.resetSelectedIndex();
		this.gridParent.delete.emit(this.cell.row);
	}
}
