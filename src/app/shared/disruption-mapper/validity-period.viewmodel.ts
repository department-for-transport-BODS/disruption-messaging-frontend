import { IValidityPeriodType } from 'src/generated/graphql';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import * as moment from 'moment';

export class ValidityPeriodViewModel {
	startDate: string;
	endDate: string;
	days: number[];
	repetition: string;
	repetitionEnd: string;
	startTime: string;
	endTime: string;

	constructor(validityPeriod: IValidityPeriodType) {
		const start = DateFormatter.createAMoment(validityPeriod.startDate, validityPeriod.startTime);
		const end = DateFormatter.createAMoment(validityPeriod.endDate, validityPeriod.endTime);
		this.startDate = DateFormatter.shortDateString(start.format());
		this.endDate = DateFormatter.shortDateString(end.format());
		this.repetition = validityPeriod.repetition;
		this.repetitionEnd = DateFormatter.shortDateString(validityPeriod.finalDate);
		this.startTime = moment(start, 'HH:mm:ss').format('HH:mm');
		const time = moment(end, 'HH:mm:ss');
		this.endTime = time.isValid() ? time.format('HH:mm') : '';
		this.days = validityPeriod.days;
	}
}
