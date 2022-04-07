import { PopoverService } from './popover.service';

describe('PopoverService', () => {
	it('should add id to list', () => {
		const service = new PopoverService();

		service.open('1');

		expect(service.popovers).toEqual(['1']);
	});

	it('should remove id from list', () => {
		const service = new PopoverService();

		service.open('1');
		expect(service.popovers).toEqual(['1']);

		service.close('1');
		expect(service.popovers.length).toBe(0);
	});

	it('should close all', () => {
		const service = new PopoverService();

		service.open('1');
		service.open('2');
		service.open('3');

		service.closeAll();
		expect(service.popovers.length).toBe(0);
	});
});
