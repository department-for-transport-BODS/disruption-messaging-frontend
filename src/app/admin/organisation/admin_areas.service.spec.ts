import {TestBed, fakeAsync, flush} from '@angular/core/testing';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';
import {IAdminAreaType, IAllAdminAreasGQL, Scalars} from '../../../generated/graphql';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {AdminAreasService} from './admin_areas.service';

describe('AdminAreasService', () => {
	let service: AdminAreasService;
	let controller: ApolloTestingController;
	const adminAreas = {
		name: 'Admin area - 1',
		areaCode: 111,
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule],
			providers: [
				IAllAdminAreasGQL,
			],
			schemas: [NO_ERRORS_SCHEMA]
		});
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(AdminAreasService);
	});


	it('fetches all admin areas', (done) => {
		service.list().subscribe(s => {
			expect(s).toEqual([adminAreas as IAdminAreaType]);
			done();
		});
		controller.expectOne('allAdminAreas').flush({data: {allAdminAreas: [{...adminAreas}]}});
		controller.verify();
	});
});
