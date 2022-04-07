import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'dm-icon-button',
	templateUrl: './icon-button.component.html',
	styleUrls: ['./icon-button.component.scss']
})
export class IconButtonComponent implements OnInit {
	@Input() btnId = '';
	@Input() icon = '';
	@Input() accessibilityLabel = '';
	@Input() size = '';
	@Input() appearance = '';
	@Input() disabled: boolean;
	@Input() active: boolean;
	@Output() onClick: EventEmitter<any> = new EventEmitter<any>();

	validButtonSizeModifications = ['xs', 'sm', 'lg', 'xl'];
	validButtonAppearanceModifications = ['minimal'];

	buttonClasses: string;
	outputClasses: string[] = ['icon-button'];

	constructor() {}

	ngOnInit() {
		if (this.validButtonSizeModifications.includes(this.size)) {
			this.outputClasses.push(`icon-button--${this.size}`);
		}

		if (this.validButtonAppearanceModifications.includes(this.appearance)) {
			this.outputClasses.push(`icon-button--${this.appearance}`);
		}

		this.buttonClasses = this.outputClasses.join(' ');
	}

	onClickButton(event: Event) {
		this.onClick.emit(event);
	}
}
