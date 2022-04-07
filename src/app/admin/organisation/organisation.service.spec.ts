import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { OrganisationService } from './organisation.service';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { IAdminAreaType, IOrganisationListGQL, IOrganisationType } from '../../../generated/graphql';
import { OrganisationMapper } from './organisation.mapper';
import { OrganisationViewModel } from './organisation.viewmodel';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockModalService } from '../../shared/services/mock-modal.service';

describe('OrganisationService', () => {
	let service: OrganisationService;
	let controller: ApolloTestingController;
	let mapper: OrganisationMapper;
	const formBuilder: FormBuilder = new FormBuilder();
	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
	let modalService: NgxSmartModalService;

	const orgResponse: IOrganisationType = {
		id: '1',
		name: 'organisation-1',
		url: 'http://foo.com',
		adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222 } as IAdminAreaType],
	} as IOrganisationType;
	let viewModel: OrganisationViewModel;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, NgxSmartModalModule.forRoot(), HttpClientTestingModule],
			providers: [
				IOrganisationListGQL,
				OrganisationMapper,
				{ provide: NgxSmartModalService, useClass: MockModalService }
			],
			schemas: [NO_ERRORS_SCHEMA]
		});
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(OrganisationService);
		mapper = TestBed.get(OrganisationMapper);
		viewModel = mapper.getModel(orgResponse);
		modalService = TestBed.get(NgxSmartModalService);

		spyOn(mapper, 'getModel').and.returnValue(viewModel);
	});

	it('fetches all organisations', done => {
		service.list().subscribe(s => {
			expect(s).toEqual([viewModel]);
			done();
		});
		controller.expectOne('organisationList').flush({ data: { allOrganisations: [{ ...orgResponse }] } });
		controller.verify();
		expect(mapper.getModel).toHaveBeenCalled();
	});

	it('creates an organisation and re-fetches list', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: [''],
			name: ['organisation-1'],
			url: ['http://foo.com'],
			adminAreas: [[{ areaCode: '111' }]]
		});

		const response = {
			id: '1',
			name: 'organisation-1',
			url: 'http://foo.com',
			adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222 }],
		};
		const vm = mapper.getModel(response as IOrganisationType);

		service.save(formGroup);
		controller.expectOne('createOrganisation').flush({
			data: {
				createOrganisation: {
					data: { ...response },
					errors: '',
					success: true
				}
			}
		});
		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(vm);
			}
		});
		controller.expectOne('organisationList').flush({ data: { allOrganisations: [{ ...orgResponse }] } });
		flush();
		controller.verify();
	}));

	it('sends an error when save fails', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: ['1'],
			name: ['organisation-1'],
			url: ['http://foo.com'],
			adminAreas: [[{ areaCode: '111' }]]
		});

		service.errors$.subscribe(s => {
			if (s) {
				expect(s).toEqual('This is an error');
			}
		});

		service.save(formGroup);
		controller.expectOne('updateOrganisation').flush({
			data: {
				updateOrganisation: {
					data: null,
					errors: 'This is an error',
					success: false
				}
			}
		});
		controller.expectOne('organisationList').flush({ data: { allOrganisations: [{ ...orgResponse }] } });

		flush();
		controller.verify();
	}));

	it('updates an organisation', fakeAsync(() => {
		const formGroup = formBuilder.group({
			id: ['1'],
			name: ['organisation-1'],
			url: ['http://foo.com'],
			adminAreas: [[{ areaCode: '111' }]]
		});

		const response = {
			id: '1',
			name: 'organisation-1',
			url: 'http://foo.com',
			adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222 }]
		};
		const vm = mapper.getModel(response as IOrganisationType);

		service.serverResponse$.subscribe(s => {
			if (s) {
				expect(s).toEqual(vm);
			}
		});
		service.save(formGroup);
		controller.expectOne('updateOrganisation').flush({
			data: {
				updateOrganisation: {
					data: { ...response },
					errors: '',
					success: false
				}
			}
		});
		//  Also re-fetch the organisation list.
		controller.expectOne('organisationList').flush({ data: { allOrganisations: [{ ...response }] } });
		flush();
		controller.verify();
	}));

	it('selects an organisation for edit', fakeAsync(() => {
		service.selectedOrganisation$.subscribe(o => {
			expect(o).toBe(viewModel);
		});
		service.editOrganisation(viewModel);
		flush();
	}));

	it('selects an organisation for add', () => {
		spyOn(modalService, 'getModal').and.returnValue(mockModal);

		service.addOrganisation();

		expect(modalService.getModal).toHaveBeenCalledTimes(1);
		expect(mockModal.open).toHaveBeenCalledTimes(1);
	});

	it('reset subjects when modal close', fakeAsync(() => {
		service.serverResponse$.subscribe(o => {
			expect(o).toBe(null);
		});
		service.errors$.subscribe(o => {
			expect(o).toBe(null);
		});
		service.modalClose();
		flush();
	}));
});
