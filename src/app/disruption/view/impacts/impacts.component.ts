import { Component, OnInit, Input } from '@angular/core';
import { ViewDisruptionViewModel } from '../view-disruption.viewmodel';

@Component({
	selector: 'dm-view-disruption-impacts',
	templateUrl: './impacts.component.html',
	styleUrls: ['./impacts.component.scss']

})
export class ViewDisruptionImpactsComponent implements OnInit {

	constructor() {}

	@Input() disruption: ViewDisruptionViewModel;

	ngOnInit(): void {}

}
