import { TestBed } from '@angular/core/testing';
import { ImpactMapService } from './impact-map.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { stops, stopsGeoJson, lines } from './impact-map.spec.data';
import { cloneDeep, keys } from 'lodash';

describe('ImpactMapService', () => {
	let service: ImpactMapService;

	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			RouterTestingModule,
			HttpClientTestingModule,
			ApolloTestingModule],
		providers: []
	}));

	beforeEach(() => {
		service = TestBed.get(ImpactMapService);
		service.resetMapData();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get selected stops as view model', (done) => {
		const cStops = cloneDeep(stops);
		service.setSelectedStops(cStops);
		service.selectedStops$.subscribe((s) => {
			expect(s).toEqual(cStops.map(stop => {
				stop.selected = true;
				return stop;
			}));
			done();
		});
	});

	it('should get selected stops as geojson', (done) => {
		service.setSelectedStops(cloneDeep(stops));
		service.stopsGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(true));
			done();
		});
	});

	it('should add a map selection', (done) => {
		service.setLines(cloneDeep(lines));
		service.setStops(cloneDeep(stops));

		service.toggleSelected(stopsGeoJson.features[0], 'stop');
		service.stopsGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(true));
			done();
		});
	});

	it('should toggle a map selection', (done) => {
		service.setLines(cloneDeep(lines));
		service.setStops(cloneDeep(stops));
		service.toggleSelected(stopsGeoJson.features[0], 'stop');
		service.toggleSelected(stopsGeoJson.features[0], 'stop');

		service.stopsGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(false));
			done();
		});
	});

	it('should select all stops', (done) => {
		service.setLines(cloneDeep(lines));
		service.setStops(cloneDeep(stops));
		service.selectAll();
		service.stopsGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(true));
			done();
		});
	});

	it('should select all lines', (done) => {
		service.setLines(cloneDeep(lines));
		service.setStops(cloneDeep(stops));
		service.selectAll();
		service.linesGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(true));
			done();
		});
	});

	it('should de-select all stops', (done) => {
		service.setLines(cloneDeep(lines));
		service.setStops(cloneDeep(stops));
		service.selectAll();
		service.deSelectAll(false);
		service.stopsGeoJson$.subscribe((s) => {
			s.features.map(f => expect(f.properties.selected).toBe(false));
			done();
		});
	});
});
