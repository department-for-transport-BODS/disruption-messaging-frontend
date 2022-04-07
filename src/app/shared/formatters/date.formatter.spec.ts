import { DateFormatter } from './date.formatter';

describe('DateFormatter', () => {
	it('should return empty when date is invalid', () => {
		const result = DateFormatter.shortDateString('empty');
		expect(result).toBe('');
	});

	it('should return formatted date in GMT', () => {
		const result = DateFormatter.shortDateString('2019-10-31T23:59:59+00:00');
		expect(result).toBe('Thu 31 Oct 19');
	});

	it('should return formatted date in BST', () => {
		const result = DateFormatter.shortDateOnlyString('2019-06-24T23:00:00+00:00');
		expect(result).toBe('Tue 25 Jun 19');
	});
});
