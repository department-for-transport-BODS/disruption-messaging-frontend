import { ValidityPeriodViewModel } from './validity-period.viewmodel';
import * as moment from 'moment';

describe('ValidityPeriodViewmModel', () => {
	it('should return blank time when none set', () => {
		const vm = new ValidityPeriodViewModel({
			id: '1',
			startDate: '2019-07-15',
			endDate: null,
			startTime: '11:11:00',
			endTime: null,
			disruption: null
		});
		expect(vm.endTime).toBe('');
	});

	it('should return time when set', () => {
		const validityStart = moment(new Date('2019-07-15T11:11:00')).utc();
		const validityEnd = moment(new Date('2019-07-15T11:12:10')).utc();
		const vm = new ValidityPeriodViewModel({
			id: '1',
			startDate: validityStart.format('YYYY-MM-DD'),
			endDate: validityEnd.format('YYYY-MM-DD'),
			startTime: validityStart.format('HH:mm:ss'),
			endTime: validityEnd.format('HH:mm:ss'),
			disruption: null
		});
		expect(vm.endTime).toEqual(validityEnd.local().format('HH:mm'));
	});
});
