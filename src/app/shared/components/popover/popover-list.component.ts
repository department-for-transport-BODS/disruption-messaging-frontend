import { Component, ElementRef, Input, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { KeyCode } from '../../testing/ng-select-helpers';

@Component({
	selector: 'dm-popover-list',
	templateUrl: './popover-list.component.html',
	styleUrls: ['./popover-list.component.scss']
})
export class PopoverListComponent implements OnInit {
	@Input() index: number;
	@Input() popoverList: string[];
	@Output() userSelectedEvent = new EventEmitter<{index: number, item: any}>();

	public show = false;
	selectedItem: any;

	constructor(private eRef: ElementRef) {}

	ngOnInit() {
		this.show = true;
	}

	@HostListener('document:click', ['$event'])
	@HostListener('document:keydown', ['$event'])
	clickout(event) {
		if (event.type === 'keydown') {
			if (event.keyCode === KeyCode.Enter) {
				if (event.target.innerText !== '' && this.popoverList.includes(event.target.innerText)) {
					this.selectedItem = event.target.innerText;
				} else {
				this.selectedItem = this.popoverList[0];
				}
			} else if (event.keyCode === KeyCode.Tab) {
				return;
			} else {
				return;
			}
		} else {
			if (this.popoverList.includes(event.target.innerText)) {
				this.selectedItem = event.target.innerText;
			} else {
				this.toggle();
				return;
			}

		}
		this.toggle();
		this.userSelectedEvent.emit({index: this.index, item: this.selectedItem});
	}

	toggle() {
		this.show = !this.show;
	}
}
