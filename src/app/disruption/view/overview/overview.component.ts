import { Component, OnInit, Input } from '@angular/core';
import { ViewDisruptionViewModel } from '../view-disruption.viewmodel';

@Component({
	selector: 'dm-view-disruption-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss']

})
export class ViewDisruptionOverviewComponent implements OnInit {

	constructor() {}

	@Input() disruption: ViewDisruptionViewModel;

	ngOnInit(): void {}

}
