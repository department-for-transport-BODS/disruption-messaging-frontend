import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'dm-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
	@Input() id = '';
	@Input() appearance = '';

	validAppearanceModifications = ['success', 'error', 'warning'];

	outputClasses: string[] = ['banner'];
	bannerClasses = '';
	icon = 'check-circle';

	constructor() {}

	ngOnInit() {
		if (this.validAppearanceModifications.includes(this.appearance)) {
			this.outputClasses.push(`banner--${this.appearance}`);
		}
		switch (this.appearance) {
			case 'error':
				this.icon = 'stop';
				break;
			case 'warning':
				this.icon = 'stop';
				break;
			case 'success':
				this.icon = 'check-circle';
				break;
		}

		this.bannerClasses = this.outputClasses.join(' ');
	}
}
