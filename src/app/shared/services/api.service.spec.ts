import { TestBed } from '@angular/core/testing';
import { ApiController, ApiService } from './api.service';
import {
	IAdminAreaType,
	IOrganisationInput,
	IOrganisationType,
} from '../../../generated/graphql';
import { OrganisationViewModel } from '../../admin/organisation/organisation.viewmodel';
import { OrganisationService } from '../../admin/organisation/organisation.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AdminModule } from '../../admin/admin.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MutationResponse } from '../types/graphql';
import { ViewModelMapper } from '../types/viewmodel-mapper';
import { getTestScheduler } from 'jasmine-marbles';
import { GraphQLError } from 'graphql';
import { OrganisationMapper } from '../../admin/organisation/organisation.mapper';

describe('ApiService', () => {
	let apiService: ApiService<IOrganisationType, OrganisationViewModel, IOrganisationInput>;
	const orgResponse: IOrganisationType = {
		id: '1',
		name: 'organisation-1',
		url: 'http://foo.com',
		adminAreas: [{ areaCode: 111, name: 'An area', shortName: 'Area', atcoAreaCode: 222 } as IAdminAreaType],
	} as IOrganisationType;
	let viewModel: OrganisationViewModel;
	let mapper: OrganisationMapper;

	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			ApolloTestingModule,
			AdminModule,
			NgxSmartModalModule.forRoot()
		],
		providers: [OrganisationService]
	}));
	beforeEach(() => {
		apiService = TestBed.get(OrganisationService);
		mapper = TestBed.get(OrganisationMapper);
		viewModel = mapper.getModel(orgResponse);
	});

	it('should be created', () => {
		expect(apiService).toBeTruthy();
	});

	it('should set errors through errorSubject', async (done) => {
		apiService.errors = 'This is an error';

		apiService.errors$.subscribe((error) => {
			expect(error).toBe('This is an error');
			done();
		});
		getTestScheduler().flush();
	});

	it('should set response through serverResponse subject', async (done) => {
		apiService.serverResponse = viewModel;

		apiService.serverResponse$.subscribe((res) => {
			expect(res).toEqual(viewModel);
			done();
		});
		getTestScheduler().flush();
	});

	it('should select model for edit', async (done) => {
		apiService.selectForEdit$().subscribe((model) => {
			expect(model).toEqual(viewModel);
			done();
		});
		apiService.selectForEdit = viewModel;
		getTestScheduler().flush();
	});

	it('should select model for delete', async (done) => {
		apiService.selectForDelete$().subscribe((model) => {
			expect(model).toEqual(viewModel);
			done();
		});
		apiService.selectForDelete = viewModel;
		getTestScheduler().flush();
	});

	it('should reset subjects when resetSubjects() is called', async (done) => {
		apiService.resetSubjects();
		apiService.errors$.subscribe((model) => {
			expect(model).toEqual(null);
			done();
		});
		apiService.serverResponse$.subscribe((model) => {
			expect(model).toEqual(null);
			done();
		});
		getTestScheduler().flush();
	});
});

const mockMapper = {
	getModel: jasmine.createSpy('getModel')
};

class TestMapper implements ViewModelMapper<string, string> {
	getModel(val: string): string {
		return val;
	}
	getMutationInput() {}
}

class TestApiService extends ApiController<string, string> {
	handleResponse(res: MutationResponse<string>) {
		this.responseHandler(res);
	}
}


describe('ApiController', () => {
	let mapper: TestMapper;
	let service: ApiController<string, string>;
	let testApiService: TestApiService;
	beforeEach(() => TestBed.configureTestingModule({
		imports: [
			ApolloTestingModule,
			AdminModule,
			NgxSmartModalModule.forRoot()
		],
		providers: [{provide: 'mockMapper', useValue: mockMapper}]
	}));
	beforeEach(() => {
		mapper = new TestMapper();
		service = new ApiController<string, string>(mapper);
		testApiService = new TestApiService(mapper);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('mutation response is available via observable', async (done ) => {
		const expected = 'a-response';
		service.serverResponse$.subscribe(res => {
			if (res) {
				expect(res).toEqual(expected);
				done();
			}
		});
		service.serverResponse = expected;
		getTestScheduler().flush();
	});

	it('errors are available over the errors$ observable.', async (done ) => {
		service.errors$.subscribe(error => {
			if (error) {
				expect(error).toEqual('an-error');
				done();
			}
		});
		service.errors = 'an-error';
		getTestScheduler().flush();
	});

	it('selectForEdit$ should emit edit selections.', async (done ) => {
		service.selectForEdit$().subscribe(entry => {
			if (entry) {
				expect(entry).toEqual('an-entry');
				done();
			}
		});
		service.selectForEdit = 'an-entry';
		getTestScheduler().flush();
	});

	it('selectForDelete$ should emit delete selections.', async (done ) => {
		service.selectForDelete$().subscribe(entry => {
			if (entry) {
				expect(entry).toEqual('an-entry');
				done();
			}
		});
		service.selectForDelete = 'an-entry';
		getTestScheduler().flush();
	});

	it('mutation response should be available on serverResponse$', async (done) => {
		const expected: MutationResponse<string> = {
			errors: null,
			data: { testResponse: {success: true, errors: null, data: 'a-response'}}
		};
		testApiService.handleResponse(expected);
		testApiService.serverResponse$.subscribe(entry => {
			expect(entry).toEqual('a-response');
			done();
		});
		getTestScheduler().flush();
	});

	it('network errors should be available on errors$', async (done) => {
		const expected: MutationResponse<string> = {errors: [{message: 'an-error'} as GraphQLError], data: null};
		testApiService.handleResponse(expected);
		testApiService.errors$.subscribe(error => {
			expect(error).toEqual('an-error');
			done();
		});
		getTestScheduler().flush();
	});

	it('mutation errors should be available on errors$', async (done) => {
		const expected: MutationResponse<string> = {
			errors: null,
			data: { testResponse: {success: false, errors: 'an-error', data: null}}};
		testApiService.handleResponse(expected);
		testApiService.errors$.subscribe(error => {
			expect(error).toEqual('an-error');
			done();
		});
		getTestScheduler().flush();
	});
});
