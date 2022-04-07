import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { IDisruptionByIdGQL, IApproveDisruptionGQL, IRejectDisruptionGQL } from 'src/generated/graphql';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import {
	IDisruptionType,
	IDisruptionReason,
	IDisruptionStatus,
	IDisruptionImpactSeverity
} from 'src/generated/enum-overrides';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';
import { ViewDisruptionService } from './view-disruption.service';
import { DisruptionReviewMapper } from './view-disruption.mapper';
import { ViewDisruptionViewModel } from './view-disruption.viewmodel';

describe('ViewDisruptionService', () => {
	let service: ViewDisruptionService;
	let controller: ApolloTestingController;
	let viewModelMapper: DisruptionReviewMapper;

	const comment: any = {
		created: moment('2019-01-01'),
		user: { id: '1', username: 'bob', email: 'bob@yahoo.com' },
		id: '1',
		comment: 'this is a comment'
	};

	const disruption: any = {
		id: 'someId',
		title: 'Summary create.',
		isTemplate: false,
		status: IDisruptionStatus.A_3,
		description: '',
		link: '',
		type: IDisruptionType.A_1,
		severity: IDisruptionImpactSeverity.A_1,
		created: moment('2019-01-01'),
		createdBy: { id: '1', username: 'bob', email: 'bob@yahoo.com' },
		publishingStart: null,
		publishingEnd: null,
		approvedBy: { id: '1', username: 'bob', email: 'bob@yahoo.com' },
		isLive: false,
		isOpenEnded: false,
		comments: [comment],
		socialMessages: [],
		impact: { edges: [] },
		reason: IDisruptionReason.A_11,
		validityPeriod: [],
		relatedDisruption: { totalCount: 0, edges: [] }
	};

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, RouterTestingModule],
			providers: [IDisruptionByIdGQL, DisruptionReviewMapper, IApproveDisruptionGQL, IRejectDisruptionGQL]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(ViewDisruptionService);
		viewModelMapper = TestBed.get(DisruptionReviewMapper);
	});

	it('should set current disruption', fakeAsync(() => {
		const viewModel: ViewDisruptionViewModel = {
			id: '1',
			title: 'titles, titles, titles',
			encodedId: 'RGlzcnVwdGlvbk5vZGU6MTMwMg==',
			isTemplate: false,
			duration: ''
		};

		spyOn(viewModelMapper, 'encodeDisruptionId').and.returnValue(viewModel.encodedId);
		spyOn(viewModelMapper, 'toDisruptionReviewViewModel').and.returnValue(viewModel);

		service.setCurrentDisruption(1);

		const disruptionById = controller.expectOne('disruptionById');
		expect(disruptionById.operation.variables.id).toEqual(viewModel.encodedId);
		disruptionById.flush({
			data: { disruption }
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toBe(viewModel);
		});
	}));

	it('should clear current disruption', fakeAsync(() => {
		const viewModel: ViewDisruptionViewModel = {
			id: '1',
			title: 'titles, titles, titles',
			encodedId: 'RGlzcnVwdGlvbk5vZGU6MTMwMg==',
			isTemplate: false,
			duration: ''
		};

		spyOn(viewModelMapper, 'encodeDisruptionId').and.returnValue(viewModel.encodedId);
		spyOn(viewModelMapper, 'toDisruptionReviewViewModel').and.returnValue(viewModel);

		service.setCurrentDisruption(1);

		const disruptionById = controller.expectOne('disruptionById');
		expect(disruptionById.operation.variables.id).toEqual(viewModel.encodedId);
		disruptionById.flush({
			data: { disruption }
		});
		flush();

		service.clearCurrentDisruption();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toBe(null);
		});
	}));
});
