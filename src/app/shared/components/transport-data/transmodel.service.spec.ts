import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ILineGQL, IOperatorByModeGQL, IModeTypeEnum, ITransModelOperatorType } from 'src/generated/graphql';
import { TransModelService } from './transmodel.service';
import { MultiLineString } from 'geojson';
import { TransModelLineViewMapper } from './transmodel.view.mapper';
import { lines } from '../../../disruption/edit/impact-map/impact-map.spec.data';

describe('TransModelService', () => {
	let controller: ApolloTestingController;
	let service: TransModelService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, RouterTestingModule],
			providers: [IOperatorByModeGQL, ILineGQL]
		}).compileComponents();

		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(TransModelService);
	});

	afterEach(() => {
		controller.verify();
	});

	it('should get list of operators', done => {
		const modes: IModeTypeEnum[] = [IModeTypeEnum.Bus, IModeTypeEnum.Ferry];
		const operator = { code: 'codey', name: 'Stagecoach', entityId: 'OP34S' };
		const allOperators: ITransModelOperatorType[] = [operator];

		const result = { data: { allOperators } };
		service.setModes(modes);
		service.listOperators().subscribe(s => {
			done();
		});

		const query = controller.expectOne('operatorByMode');
		query.flush(result);
		expect(query.operation.variables.modes).toBe(modes);
	});

	it('should get line information', done => {
		const entityId = 'opEntID';
		const result = { data: { line: lines[0] } };

		service.line(entityId).subscribe(s => {
			expect(s.entityId).toEqual('LIN007');
			const mappedLine = TransModelLineViewMapper.toLinesGeoJson([s]);
			const geometryLine = mappedLine.features[0].geometry as MultiLineString;
			expect(geometryLine.coordinates).toEqual([[[0, 1], [1, 2]]]);
			expect(geometryLine.type).toEqual('MultiLineString');
			// TODO: Add same test for stops
			done();
		});

		const query = controller.expectOne('line');
		query.flush(result);
		expect(query.operation.variables.entityId).toBe(entityId);
	});

	it('should search stops', done => {
		const term = 'search';
		const modes = [IModeTypeEnum.Bus];
		const stops = [
			{
				featureName: 'Busway',
				entityId: 'ST021',
				atcoCode: '021',
				stopType: null,
				lat: 0,
				lon: 0
			}
		];
		const result = { data: { searchStops: stops } };
		service.setModes(modes);
		service.searchStops(term).subscribe(s => {
			done();
		});

		const query = controller.expectOne('searchStops');
		query.flush(result);
		expect(query.operation.variables.term).toBe(term);
	});
});
