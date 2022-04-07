export interface ReviewsListViewModel {
	// This class represents a single (readonly) row in the reviews list

	id: string;
	encodedId: string;
	title: string;
	serviceModes: string;
	operatorWide: boolean;
	networkWide: boolean;
	servicesAffectedCount: number;
	stopsAffectedCount: number;
	operatorsCount: number;
	startDate: string;
	endDate: string;
	severity: string;
	createdDate: string;
	createdBy: string;
}
