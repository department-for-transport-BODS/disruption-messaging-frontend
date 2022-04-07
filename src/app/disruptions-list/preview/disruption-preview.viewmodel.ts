import { ValidityPeriodViewModel } from '../../shared/disruption-mapper/validity-period.viewmodel';

export interface DisruptionPreviewViewModel {
	// This class represents all the fields necessary to preview a disruption

	id: string;
	encodedId: string;
	title: string;
	createdBy: string;
	isTemplate?: boolean;
	severity?: string;
	status?: string;
	isLive?: boolean;
	description?: string;
	reason?: string;
	delay?: string;
	networkWide?: boolean;
	operatorWide?: boolean;
	servicesAffected?: string;
	stopsSummary?: string;
	duration?: string;
	validityPeriods?: ValidityPeriodViewModel[];
	operators?: string;
}
