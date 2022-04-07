import { Component, ElementRef, Input, HostListener, OnInit } from '@angular/core';
import { PopoverService } from './popover.service';

@Component({
	selector: 'dm-popover',
	templateUrl: './popover.component.html',
	styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {
	@Input() triggerButtonAppearance = 'toggle';
	@Input() triggerButtonSize: string;
	@Input() triggerAccessibilityLabel: string;
	@Input() triggerLabel: string;
	@Input() triggerIcon: string;
	@Input() triggerCount: number;
	@Input() identifier: string;

	id: string;

	constructor(private eRef: ElementRef, private popoverService: PopoverService) {}

	ngOnInit() {
		this.id = this.identifier;
	}

	@HostListener('document:click', ['$event'])
	clickout(event: Event) {
		if (!this.eRef.nativeElement.contains(event.target) && this.isOpen) {
			this.popoverService.close(this.identifier);
		}
	}

	toggleDropdown(): void {
		if (this.isOpen) {
			this.popoverService.close(this.identifier);
		} else {
			this.popoverService.open(this.identifier);
		}
	}

	get isOpen(): boolean {
		return this.popoverService.popovers.find(f => f === this.identifier) ? true : false;
	}
}
