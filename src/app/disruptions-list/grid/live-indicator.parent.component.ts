import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
	selector: 'clickable-cell',
	template: `
		<span>{{ this.status }}</span
		><dm-live-indicator *ngIf="this.isLive"></dm-live-indicator>
	`,
	styles: [':host{overflow: visible; text-overflow: clip; display: flex; align-items: center}']
})
export class LiveIndicatorParentComponent implements ICellRendererAngularComp {
	public params: any = false;
	public isLive = false;
	public status = '';

	agInit(params: any): void {
		this.params = params;
		this.isLive = params.data && params.data.isLive;
		this.status = params.data && params.data.status;
	}

	refresh(): boolean {
		return false;
	}
}
