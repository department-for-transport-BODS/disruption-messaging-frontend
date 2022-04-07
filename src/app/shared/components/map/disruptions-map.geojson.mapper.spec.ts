import { TestBed } from '@angular/core/testing';

import { GeojsonMapper } from './disruptions-map.geojson.mapper';

describe('GeojsonService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [GeojsonMapper]
		})
	);

	it('should be created', () => {
		const service: GeojsonMapper = TestBed.get(GeojsonMapper);
		expect(service).toBeTruthy();
	});
});
