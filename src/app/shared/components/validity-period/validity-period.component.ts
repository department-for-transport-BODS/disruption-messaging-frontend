import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'dm-validity-period',
	templateUrl: './validity-period.component.html',
	styleUrls: ['./validity-period.component.scss']
})
export class ValidityPeriodComponent implements OnInit {
	@Input() periods: object;
	@Input() dividers: boolean;
	constructor() {}

	outputClasses: string[] = ['validity-period'];
	validityPeriodClasses = '';

	ngOnInit() {
		if (this.dividers) {
			this.outputClasses.push(`validity-period--with-dividers`);
		}

		this.validityPeriodClasses = this.outputClasses.join(' ');
	}
}
