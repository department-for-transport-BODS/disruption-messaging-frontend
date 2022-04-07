import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'dm-button-group',
	templateUrl: './button-group.component.html',
	styleUrls: ['./button-group.component.scss']
})
export class ButtonGroupComponent implements OnInit {
	@Input() segmented: boolean;
	@Input() justify: string;

	validJustifyModifications = ['center', 'right']; // default left

	outputClasses: string[] = ['button-group'];
	buttonGroupClasses = '';

	constructor() {}

	ngOnInit() {
		if (this.validJustifyModifications.includes(this.justify)) {
			this.outputClasses.push(`button-group--${this.justify}`);
		}
		if (this.segmented) {
			this.outputClasses.push('button-group--segmented');
		}
		this.buttonGroupClasses = this.outputClasses.join(' ');
	}
}
