export interface DisruptionsDashboardViewModel {
	id: string;
	encodedId: string;
	title: string;
	operatorWide: boolean;
	networkWide: boolean;
	operatorCount?: number;
	servicesAffectedCount?: number;
	stopsAffectedCount?: number;
	startDate: string;
	endDate: string;
	severity: string;
}
