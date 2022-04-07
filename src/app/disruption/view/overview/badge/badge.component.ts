import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'dm-badge',
	templateUrl: './badge.component.html',
	styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {
	@Input() id: string;
	@Input() size: string;
	@Input() route: string[];
	@Input() title: string;

	validSizeModidifications = ['sm', 'md', 'lg'];

	outputClasses: string[] = ['badge'];
	badgeClasses = '';

	constructor(private router: Router) {}

	ngOnInit() {
		if (this.validSizeModidifications.includes(this.size)) {
			this.outputClasses.push(`badge--${this.size}`);
		}

		this.badgeClasses = this.outputClasses.join(' ');
	}

	gotoRoute($event: Event, url: []) {
		$event.preventDefault();
		this.router.navigate(url).then(e => {
			if (!e) {
				console.log('Navigation has failed!');
			}
		});
	}
}
