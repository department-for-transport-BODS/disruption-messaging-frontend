import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { IEnumValuesGQL, ISetEnumsGQL, IEnumOverridesInput } from 'src/generated/graphql';
import { SettingsViewModelMapper } from './settings.viewmodel.mapper';
import { EnumValueViewModel } from './settings.viewmodel';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
	let service: SettingsService;
	let controller: ApolloTestingController;
	let mapper: SettingsViewModelMapper;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [IEnumValuesGQL, ISetEnumsGQL, SettingsViewModelMapper]
		});
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(SettingsService);
		mapper = TestBed.get(SettingsViewModelMapper);
	});

	const viewModels: EnumValueViewModel[] = [
		{
			allValues: [],
			currentValues: [],
			type: 'Reason'
		}
	];

	const response = {
		id: '1',
		type: 'Reason',
		values: [],
		allValues: []
	};
	const params: IEnumOverridesInput[] = [
		{
			type: 'Reason',
			values: ['Unknown']
		}
	];

	it('fetches all enums', done => {
		spyOn(mapper, 'toViewModel').and.returnValue(viewModels);
		service.enumValueViewModelList().subscribe(s => {
			expect(mapper.toViewModel).toHaveBeenCalled();
			expect(s).toEqual(viewModels);
			done();
		});
		controller.expectOne('enumValues').flush({ data: { enumValues: [response] } });
		controller.verify();
	});

	it('sets enum list', fakeAsync(() => {
		spyOn(mapper, 'toGraphQLInput').and.returnValue(params);

		service.setEnumValues(viewModels);
		const mutation = controller.expectOne('setEnums');
		expect(mutation.operation.variables.params).toBe(params);

		mutation.flush({
			data: {
				setEnumOverrides: {
					data: { ...response },
					errors: '',
					success: true
				}
			}
		});

		flush();

		controller.verify();
	}));
});
