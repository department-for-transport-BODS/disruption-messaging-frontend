import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ImpactViewModel } from 'src/app/shared/disruption-mapper/impact.viewmodel';
import { PopoverService } from '../popover/popover.service';

@Component({
	selector: 'dm-impact-list-item',
	templateUrl: './impact-list-item.component.html',
	styleUrls: ['./impact-list-item.component.scss']
})
export class ImpactListItemComponent {
	@Input() impact: ImpactViewModel;
	@Input() index: number;
	@Input() editable: boolean;

	@Output() editEmit = new EventEmitter<number>();
	@Output() removeEmit = new EventEmitter<number>();
	@Output() duplicateEmit = new EventEmitter<number>();

	constructor(private popoverService: PopoverService) {}

	edit(idx: any): void {
		this.editEmit.emit(idx);
	}

	remove(idx: number): void {
		this.popoverService.close(`popover-${idx}`);
		this.removeEmit.emit(idx);
	}

	duplicate(idx: number): void {
		this.popoverService.close(`popover-${idx}`);
		this.duplicateEmit.emit(idx);
	}
}
