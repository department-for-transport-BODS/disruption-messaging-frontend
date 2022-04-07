import { Moment as MomentType } from 'moment';

interface IDateRangeInput {
	startDate: MomentType;
	endDate: MomentType;
}

export class DisruptionsFilter {
	searchText: string;
	mode: string;
	status: string;
	severity: string;
	operators: string[];
	lines: string[];
	dateRange: IDateRangeInput;
	isTemplate: boolean;

	constructor() {
		this.searchText = '';
		this.mode = '';
		this.status = '';
		this.severity = '';
		this.operators = null;
		this.lines = null;
		this.dateRange = null;
		this.isTemplate = false;
	}
}
