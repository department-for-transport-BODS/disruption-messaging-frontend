import { Component, Input } from '@angular/core';
import { DisruptionsDashboardViewModel } from '../disruptions-dashboard.viewmodel';
@Component({
	selector: 'disruption-summary',
	templateUrl: './disruption-summary.component.html',
	styleUrls: ['./disruption-summary.component.scss']
})
export class DisruptionSummaryComponent {
	@Input()
	data: DisruptionsDashboardViewModel;
}
