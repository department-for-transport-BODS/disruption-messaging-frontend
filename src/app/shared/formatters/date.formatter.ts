import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class DateFormatter {
	public static ISODateFormat = 'YYYY-MM-DD';
	public static ISODateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';
	public static LocalDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
	public static timeFormat = 'HH:mm';

	public static shortDateString(inputISOdate: string): string {
		const outputFormat = 'ddd D MMM YY';
		const date = moment(inputISOdate, this.ISODateFormat);
		return date.isValid() ? date.format(outputFormat) : '';
	}

	public static shortDateOnlyString(inputISOdate: string): string {
		const outputFormat = 'ddd D MMM YY';
		const date = moment.utc(inputISOdate, this.ISODateTimeFormat).local();
		return date.isValid() ? date.format(outputFormat) : '';
	}

	public static dateOnlyString(inputISOdate: string): string {
		const outputFormat = 'DD MMM YYYY';
		const date = moment.utc(inputISOdate, this.ISODateTimeFormat).local();
		return date.isValid() ? date.format(outputFormat) : '';
	}

	public static timeWithoutSecondsString(inputISOdate: string): string {
		const outputFormat = 'HH:mm';
		return moment(inputISOdate).format(outputFormat);
	}

	public static shortTime(inputISOdate: string): string {
		const outputFormat = 'HH:mm:ss';
		return moment(inputISOdate).format(outputFormat);
	}

	public static shortDate(inputISOdate: string): string {
		const outputFormat = 'DD/MM/YYYY';
		return moment(inputISOdate, this.ISODateFormat).format(outputFormat);
	}

	public static shortDateAndTime(inputISOdateTime: string): string {
		const outputFormat = 'DD/MM/YYYY HH:mm:ss';
		const date = moment.utc(inputISOdateTime, this.ISODateTimeFormat).local();
		return date.isValid() ? date.format(outputFormat) : '';
	}

	public static inputDate(date: moment.Moment): string {
		return date.format(this.ISODateFormat);
	}

	public static inputTime(date: moment.Moment): string {
		return date.format(this.timeFormat);
	}

	public static localDateTimeString(dateTime: string): string {
		return moment.utc(dateTime).local().format('YYYY-MM-DD HH:mm:ss');
	}

	public static createAMoment(date: string, time: string): moment.Moment {
		return moment.utc(`${date}T${time}`, 'YYYY-MM-DDTHH:mm:ss').local();
	}
}
