import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { DisruptionsListService } from './disruptions-list.service';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { IDisruptionNode, IDisruptionPreviewByIdGQL, IDisruptionsListGQL } from 'src/generated/graphql';
import * as disruptionTestdata from '../shared/disruption-mapper/disruption-testdata';
import { DisruptionPreviewViewModel } from './preview/disruption-preview.viewmodel';
import { DisruptionPreviewMapper } from './preview/disruption-preview.mapper';
import { NgxSmartModalModule } from 'ngx-smart-modal';

describe('DisruptionsListService', () => {
	let apolloController: ApolloTestingController;
	let disruptionListService: DisruptionsListService;
	let mapper: DisruptionPreviewMapper;

	const disruption = disruptionTestdata.disruption;
	const previewViewModel: DisruptionPreviewViewModel = {
		id: 'id',
		encodedId: 'REGERWEREW',
		title: 'This is a fake title.',
		createdBy: 'test_user'
	};

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, NgxSmartModalModule.forRoot()],
			providers: [IDisruptionsListGQL, IDisruptionPreviewByIdGQL, DisruptionsListService, DisruptionPreviewMapper]
		}).compileComponents()
	);

	beforeEach(() => {
		apolloController = TestBed.get(ApolloTestingController);
		disruptionListService = TestBed.get(DisruptionsListService);
		mapper = TestBed.get(DisruptionPreviewMapper);

		spyOn(mapper, 'getDisruptionPreview').and.returnValue(previewViewModel);
	});

	afterEach(() => {
		apolloController.verify();
	});

	it('should fetch and map the results to view model', fakeAsync(() => {
		const id = '1';

		disruptionListService.setPreviewDisruption(id);

		const disruptionById = apolloController.expectOne('disruptionPreviewById');
		expect(disruptionById.operation.variables.id).toEqual(id);
		disruptionById.flush({
			data: {
				disruption
			}
		});
		flush();

		disruptionListService.previewDisruption$.subscribe(res => {
			expect(mapper.getDisruptionPreview).toHaveBeenCalledWith(disruption as IDisruptionNode);
			expect(res).toBe(previewViewModel);
		});
	}));

	it('should remove disruption on unload', fakeAsync(() => {
		// setup the disruption$ with value.
		disruptionListService.setPreviewDisruption('1');

		const op = apolloController.expectOne('disruptionPreviewById');
		op.flush({
			data: { disruption }
		});

		flush();

		// now unload and test.
		disruptionListService.clearPreviewDisruption();

		disruptionListService.previewDisruption$.subscribe(val => {
			expect(val).toBe(null);
		});
	}));
});
