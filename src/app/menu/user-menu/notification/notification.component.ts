import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'dm-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
	@Input() message: string;
	@Input() status: string;
	@Input() date: string;
	@Input() type: string;
	@Input() duplicates: Array<string>;
	@Input() id: string;
	@Output() onClear: EventEmitter<any> = new EventEmitter<any>();

	constructor() {}

	ngOnInit() {}

	onClick($event) {
		if (this.duplicates && this.duplicates.length === 0) {
			this.onClear.emit($event);
		}
	}

	acknowledge($event) {
		if (this.duplicates && this.duplicates.length > 0) {
			this.onClear.emit($event);
		}
	}
}
