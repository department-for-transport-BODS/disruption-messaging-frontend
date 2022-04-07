import { TestBed } from '@angular/core/testing';

import { TabsService } from './tabs.service';

describe('TabServiceService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TabsService = TestBed.get(TabsService);
		expect(service).toBeTruthy();
	});
});
