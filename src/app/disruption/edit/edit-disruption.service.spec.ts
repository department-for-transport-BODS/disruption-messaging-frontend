import { TestBed, fakeAsync, flush } from '@angular/core/testing';

import { EditDisruptionService } from './edit-disruption.service';
import {
	ICreateDisruptionGQL,
	IUpdateDisruptionGQL,
	IDisruptionCreateInput,
	IDisruptionTypeInput,
	IDisruptionReasonInput,
	ISubmitDisruptionGQL,
	IDisruptionByIdForEditGQL,
	IDisruptionNode
} from 'src/generated/graphql';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import {
	IDisruptionType,
	IDisruptionReason,
	IDisruptionStatus,
	ISocialRegistrationAccountType
} from 'src/generated/enum-overrides';
import { RouterTestingModule } from '@angular/router/testing';
import { IFormSubmittedState } from 'src/app/shared/forms/FormStateEnum';
import { FormBuilder } from '@angular/forms';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import * as moment from 'moment';
import { IEditDisruptionViewModelMapper } from './edit-disruption.view-model.mapper';
import { IEditDisruptionGraphQLMapper } from './edit-disruption.graphql.mapper';
import { GraphQLError } from 'graphql';

describe('EditDisruptionService', () => {
	let service: EditDisruptionService;
	let controller: ApolloTestingController;
	let viewModelMapper: IEditDisruptionViewModelMapper;
	let graphQLMapper: IEditDisruptionGraphQLMapper;

	const formBuilder: FormBuilder = new FormBuilder();

	const iDisruptionCreateInput: IDisruptionCreateInput = {
		title: 'A fake disruption create input object.',
		description: '',
		link: '',
		type: IDisruptionTypeInput.Planned,
		reason: IDisruptionReasonInput.Congestion,
		relatedDisruption: [{}],
		publishingStart: null,
		publishingEnd: null,
		impact: [],
		validityPeriod: []
	};

	const disruption: IDisruptionNode = {
		id: 'someId',
		title: 'Summary create.',
		description: '',
		link: '',
		type: IDisruptionType.A_1,
		reason: IDisruptionReason.A_11,
		relatedDisruption: { pageInfo: { hasNextPage: false, hasPreviousPage: false }, edges: [] },
		publishingStart: null,
		publishingEnd: null,
		impact: { pageInfo: { hasNextPage: false, hasPreviousPage: false }, edges: [] },
		validityPeriod: [],
		modified: '2019-01-01',
		socialMessages: [],
		created: moment('2019-01-01'),
		createdBy: { id: '1', username: 'bob', email: 'bob@yahoo.com' },
		deleted: false,
		isTemplate: false,
		status: IDisruptionStatus.A_3,
		version: 1,
		isOpenEnded: false
	} as IDisruptionNode;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, RouterTestingModule],
			providers: [
				ICreateDisruptionGQL,
				IUpdateDisruptionGQL,
				ISubmitDisruptionGQL,
				IDisruptionByIdForEditGQL,
				IEditDisruptionGraphQLMapper,
				IEditDisruptionViewModelMapper,
				{ provide: FormBuilder, useValue: formBuilder }
			]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(EditDisruptionService);
		viewModelMapper = TestBed.get(IEditDisruptionViewModelMapper);
		graphQLMapper = TestBed.get(IEditDisruptionGraphQLMapper);
	});

	it('should be created with empty disruption to edit', () => {
		expect(service).toBeTruthy();
		service.currentDisruption$.subscribe(s => expect(s).toEqual(null));
	});

	it('should be created with empty errors', () => {
		expect(service).toBeTruthy();
		service.currentDisruption$.subscribe(s => expect(s).toEqual(null));
	});

	it('should be created with submit status as pending', () => {
		expect(service).toBeTruthy();
		service.formSubmitStatus$.subscribe(s => expect(s).toEqual(IFormSubmittedState.Pending));
	});

	it('should set the form submit status', () => {
		service.setSubmittedStatus(IFormSubmittedState.Draft);

		service.formSubmitStatus$.subscribe(s => {
			expect(s).toBe(IFormSubmittedState.Draft);
		});
	});

	it('should create disruption when new.', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: [''],
			submitComment: ['']
		});
		const viewModel: IEditDisruptionViewModel = {
			id: 'someId',
			summary: 'this is mandatory'
		};

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.saveDisruption(formGroup);

		const query = controller.expectOne('createDisruption');
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		query.flush({
			data: {
				createDisruption: {
					success: true,
					errors: null,
					data: disruption
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toEqual(viewModel);
		});

		service.formSubmitStatus$.subscribe(submitStatus => {
			expect(submitStatus).toBe(IFormSubmittedState.Saved);
		});
	}));

	it('should create disruption template.', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: [''],
			submitComment: ['']
		});
		const viewModel: IEditDisruptionViewModel = {
			id: '1',
			summary: 'this is mandatory'
		};

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);
		iDisruptionCreateInput.isTemplate = true;
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.saveDisruption(formGroup, false, true);

		const query = controller.expectOne('createDisruption');
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		query.flush({
			data: {
				createDisruption: {
					success: true,
					errors: null,
					data: disruption
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toEqual(viewModel);
		});

		service.formSubmitStatus$.subscribe(submitStatus => {
			expect(submitStatus).toBe(IFormSubmittedState.Saved);
		});
	}));

	it('should submit after creating new disruption.', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: [''],
			submitComment: ['Submit this for publication']
		});
		const viewModel: IEditDisruptionViewModel = {
			id: '1',
			summary: 'this is mandatory'
		};

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.submitForPublication(formGroup);

		const query = controller.expectOne('createDisruption');
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		query.flush({
			data: {
				createDisruption: {
					success: true,
					errors: null,
					data: disruption
				}
			}
		});
		flush();

		const sumbitQuery = controller.expectOne('submitDisruption');
		expect(sumbitQuery.operation.variables.id).toEqual(viewModel.id);
		expect(sumbitQuery.operation.variables.comment).toEqual('Submit this for publication');

		sumbitQuery.flush({
			data: {
				submitDisruption: {
					success: true,
					errors: null,
					data: {}
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toEqual(viewModel);
		});

		service.formSubmitStatus$.subscribe(submitStatus => {
			expect(submitStatus).toBe(IFormSubmittedState.Submitted);
		});
	}));

	it('should set errors when create fails', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: [''],
			submitComment: ['']
		});

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);

		service.saveDisruption(formGroup);

		const query = controller.expectOne('createDisruption');
		const errorArr = ['An array', 'Of errors'];
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		query.flush({
			data: {
				createDisruption: {
					success: false,
					errors: errorArr,
					data: null
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toBe(null);
		});

		service.errors$.subscribe(serverErrors => {
			expect(serverErrors).toBe(errorArr);
		});
	}));

	it('should call update disruption', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: ['1'],
			submitComment: ['']
		});
		const viewModel: IEditDisruptionViewModel = {
			id: '1',
			summary: 'this is mandatory'
		};

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.saveDisruption(formGroup);

		const query = controller.expectOne('updateDisruption');
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		expect(query.operation.variables.id).toEqual('1');

		query.flush({
			data: {
				updateDisruption: {
					success: true,
					errors: null,
					data: disruption
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(s => {
			expect(s).toEqual(viewModel);
		});
	}));

	it('should set errors when update fails', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: ['1'],
			submitComment: ['']
		});

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);

		service.saveDisruption(formGroup);

		const query = controller.expectOne('updateDisruption');
		const errorArr = ['An array', 'Of errors'];
		expect(query.operation.variables.params).toEqual(iDisruptionCreateInput);
		query.flush({
			data: {
				updateDisruption: {
					success: false,
					errors: errorArr,
					data: null
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toBe(null);
		});

		service.errors$.subscribe(serverErrors => {
			expect(serverErrors).toBe(errorArr);
		});
	}));

	it('should submit updated disruption', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: ['1'],
			submitComment: ['Submit this please.']
		});
		const viewModel: IEditDisruptionViewModel = {
			id: '1',
			summary: 'this is mandatory'
		};

		spyOn(graphQLMapper, 'toDisruptionInput').and.returnValue(iDisruptionCreateInput);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.submitForPublication(formGroup);

		const updateQuery = controller.expectOne('updateDisruption');
		expect(updateQuery.operation.variables.params).toEqual(iDisruptionCreateInput);
		expect(updateQuery.operation.variables.id).toEqual('1');

		updateQuery.flush({
			data: {
				updateDisruption: {
					success: true,
					errors: null,
					data: disruption
				}
			}
		});
		flush();

		const sumbitQuery = controller.expectOne('submitDisruption');
		expect(sumbitQuery.operation.variables.id).toEqual('1');
		expect(sumbitQuery.operation.variables.comment).toEqual('Submit this please.');

		sumbitQuery.flush({
			data: {
				submitDisruption: {
					success: true,
					errors: null,
					data: {}
				}
			}
		});
		flush();

		service.currentDisruption$.subscribe(s => {
			expect(s).toEqual(viewModel);
		});

		service.formSubmitStatus$.subscribe(submitStatus => {
			expect(submitStatus).toBe(IFormSubmittedState.Submitted);
		});
	}));

	it('should set current disruption', fakeAsync(() => {
		const fakeId = 'RGlzcnVwdGlvbk5vZGU6MTMwMg==';
		const viewModel: IEditDisruptionViewModel = {
			id: fakeId,
			summary: 'this is mandatory'
		};

		spyOn(viewModelMapper, 'encodeDisruptionId').and.returnValue(fakeId);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.setCurrentDisruption(1);

		const disruptionForEditQuery = controller.expectOne('disruptionByIdForEdit');
		expect(disruptionForEditQuery.operation.variables.id).toEqual(fakeId);
		disruptionForEditQuery.flush({
			data: { disruption }
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption).toBe(viewModel);
		});
	}));

	it('should set current disruption and remove ids and published messages for duplication', fakeAsync(() => {
		const now = moment.utc();
		const viewModel: IEditDisruptionViewModel = {
			id: '1',
			summary: 'this is mandatory',
			socialMessages: [
				{
					id: 'string',
					socialAccount: {
						createdBy: 'sa',
						name: 'sa',
						organisation: null,
						id: '23',
						username: 'account_21',
						email: null,
						accountType: ISocialRegistrationAccountType.A_1,
						prettyName: '',
						isHootSuite: false,
						hootSuiteProfiles: null
					},
					hootSuiteProfile: null,
					text: 'text',
					image: {
						name: 'image.png',
						url: 'test/image.png'
					},
					publishOn: now,
					published: true,
					publishedOn: now,
					lastPublishedError: 'some error'
				}
			],
			validityPeriods: [],
			impacts: []
		};
		const fakeId = 'RGlzcnVwdGlvbk5vZGU6MTMwMg==';

		spyOn(viewModelMapper, 'encodeDisruptionId').and.returnValue(fakeId);
		spyOn(viewModelMapper, 'toEditDisruptionViewModel').and.returnValue(viewModel);

		service.setCurrentDisruption(1, true);

		const disruptionForEditQuery = controller.expectOne('disruptionByIdForEdit');
		expect(disruptionForEditQuery.operation.variables.id).toEqual(fakeId);
		disruptionForEditQuery.flush({
			data: { disruption }
		});
		flush();

		service.currentDisruption$.subscribe(currentDisruption => {
			expect(currentDisruption.socialMessages.length).toBe(1);
			expect(currentDisruption.socialMessages[0].publishedOn).toBe(null);
			expect(currentDisruption.socialMessages[0].published).toBeFalsy();
			expect(currentDisruption.socialMessages[0].lastPublishedError).toEqual('');
			expect(currentDisruption.socialMessages[0].socialAccount).toEqual(
				viewModel.socialMessages[0].socialAccount
			);
		});
	}));

	// Ignored because the errors cause a lot of information to go to console which looks
	// like the test has failed.
	xit('should set current disruption errors when fails', fakeAsync(() => {
		const fakeId = 'RGlzcnVwdGlvbk5vZGU6MTMwMg==';

		spyOn(viewModelMapper, 'encodeDisruptionId').and.returnValue(fakeId);

		service.setCurrentDisruption(1);

		const disruptionForEditQuery = controller.expectOne('disruptionByIdForEdit');
		expect(disruptionForEditQuery.operation.variables.id).toEqual(fakeId);
		const error = 'error with requests';
		disruptionForEditQuery.graphqlErrors([new GraphQLError(error)]);
		flush();

		service.errors$.subscribe(err => {
			expect(err).toBe('Disruption 1 could not be found');
		});
	}));
});
