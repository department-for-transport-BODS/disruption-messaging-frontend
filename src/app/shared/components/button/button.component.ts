import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'dm-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
	@Input() btnId;
	@Input() iconBefore = '';
	@Input() iconAfter = '';
	@Input() accessibilityLabel;
	@Input() accessibilityExpanded;
	@Input() size = '';
	@Input() appearance = '';
	@Input() expand: boolean;
	@Input() disabled = false;
	@Input() active: boolean;
	@Input() type: string;
	@Input() route: string[]; // use when routing to an internal page
	@Input() url: string; // use when user is being directed to an external page
	@Output() onClick: EventEmitter<any> = new EventEmitter<any>();

	validButtonSizeModifications = ['xs', 'sm', 'lg', 'xl'];
	validButtonAppearanceModifications = ['primary', 'minimal', 'toggle', 'warning'];

	outputClasses: string[] = ['button'];
	buttonClasses = '';

	constructor(private router: Router) {}

	ngOnInit() {
		if (this.validButtonSizeModifications.includes(this.size)) {
			this.outputClasses.push(`button--${this.size}`);
		}

		if (this.validButtonAppearanceModifications.includes(this.appearance)) {
			this.outputClasses.push(`button--${this.appearance}`);
		}

		if (this.expand) {
			this.outputClasses.push(`button--block`);
		}

		this.buttonClasses = this.outputClasses.join(' ');
		this.type = this.type || 'button';
	}

	onClickButton(event) {
		this.onClick.emit(event);
	}

	gotoRoute($event, url) {
		$event.preventDefault();
		this.router.navigate(url).then(e => {
			if (!e) {
				console.log('Navigation has failed!');
			}
		});
	}
}
