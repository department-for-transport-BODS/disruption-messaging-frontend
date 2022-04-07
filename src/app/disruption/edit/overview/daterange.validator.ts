import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

export class DateRangeValidator {
	public static validityPeriod(isOpenEnded: boolean) {
		return (group: FormGroup): { [key: string]: any } => {
			const repeats = group.controls.repeats.value;
			const start = moment(group.controls.startDate.value);
			const end = moment(group.controls.endDate.value);
			const ending = moment(group.controls.ending.value);

			// if end is set it must be after the start.
			if (end.isValid() && start.isAfter(end)) {
				return { invalidDates: true };
			}

			// group has been updated, start must be set.
			if (group.dirty && !start.isValid()) {
				return { start_required: true };
			}

			// if repeats or is not open ended then end date is always required.
			if (start.isValid() && (repeats || !isOpenEnded) && !end.isValid()) {
				return { end_required: true };
			}

			// For daily repetitions, end-date should be the same day as the start day.
			if (start.isValid() && end.isValid() && repeats === 'Daily') {
				const duration = moment.duration(end.diff(start)).asHours();
				if (duration > 24) {
					return { invalidRangeDaily: true };
				}
			}

			// For weekly repetitions, end-date should within 7 days of the start date..
			if (start.isValid() && end.isValid() && repeats === 'Weekly') {
				if (moment.duration(end.diff(start)).days() > 6) {
					return { invalidRangeWeekly: true };
				}
			}

			// if repeats and it's not open ended the final ending must be set.
			if (start.isValid() && repeats && !isOpenEnded && !ending.isValid()) {
				return { ending_required: true };
			}

			// is end is set and the disruption repeats the ending must be same or after final date
			if (end.isValid() && repeats && !end.isSameOrBefore(ending, 'day') && !isOpenEnded) {
				return { invalidEnding: true };
			}
		};
	}

	public static publishingDates() {
		return (group: FormGroup): { [key: string]: any } => {
			const publishingStart = group.controls.publishingStart.value;
			const publishingEnd = group.controls.publishingEnd.value;

			if (publishingStart !== null && publishingEnd !== null) {
				if (publishingStart.isAfter(publishingEnd)) {
					return { publishingRange: true };
				}
			}

			const validityPeriods = group.controls.validityPeriods.value;

			if (validityPeriods.length) {
				const anyValid = validityPeriods.findIndex(f => f.startDate !== null);
				if (anyValid === -1) {
					return { validityPeriodRequired: true };
				}

				const lastDate = validityPeriods.reduce((prev, current) => {
					let prevEndDate;
					if (prev.repeats) {
						prevEndDate = moment(prev.ending);
					} else {
						prevEndDate = moment(prev.endDate);
					}
					let currentEndDate;
					if (current.repeats) {
						currentEndDate = moment(current.ending);
					} else {
						currentEndDate = moment(current.endDate);
					}
					return currentEndDate.isAfter(prevEndDate) ? current : prev;
				});

				const firstDate = validityPeriods.reduce((prev, current) => {
					const prevStartDate = moment(prev.startDate);
					const currentStartDate = moment(current.startDate);
					return currentStartDate.isBefore(prevStartDate) ? current : prev;
				});

				if (firstDate !== null && publishingStart !== null) {
					if (publishingStart.isAfter(firstDate.startDate)) {
						return { validityPeriodBeforeStart: true };
					}
				}

				if (group.controls.publishingEnd.disabled) {
					return;
				}

				if (lastDate.endDate !== null && publishingEnd !== null) {
					let endingDate;
					if (lastDate.repeats) {
						endingDate = moment(lastDate.ending);
					} else {
						endingDate = moment(lastDate.endDate);
					}
					if (publishingEnd.isBefore(endingDate)) {
						return { validityPeriodAfterEnd: true };
					}
				}
			}
		};
	}

	public static disallowMultipleValidityPeriods() {
		return (group: FormGroup): { [key: string]: any } => {
			const openEnded = group.controls.isOpenEnded.value;
			const validityPeriods = group.controls.validityPeriods.value;

			if (openEnded && validityPeriods.length > 1) {
				return { openEndedMulti: true};
			}
		};
	}
}
