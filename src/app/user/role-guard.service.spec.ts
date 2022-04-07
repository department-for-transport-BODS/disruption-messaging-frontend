import { TestBed } from '@angular/core/testing';

import { RoleGuardService } from './role-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStoreService } from './user.store.service';
import { Router } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

const mockRouter = {
	navigate: jasmine.createSpy('navigate')
};

const mockUserStore = {
	isAuthorisedForSettings: jasmine.createSpy('isAuthorisedForSettings')
};

let roleGuardService: RoleGuardService;

describe('RoleGuardService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, ApolloTestingModule],
			providers: [
				RoleGuardService,
				{ provide: UserStoreService, useValue: mockUserStore },
				{ provide: Router, useValue: mockRouter }
			]
		})
	);

	beforeEach(() => {
		roleGuardService = TestBed.get(RoleGuardService);
	});

	it('should be route to login when not authenticated', () => {
		mockUserStore.isAuthorisedForSettings.and.returnValue(false);

		roleGuardService.canActivate();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/not-found']);
	});

	it('should be return true when authenticated', () => {
		mockUserStore.isAuthorisedForSettings.and.returnValue(true);

		roleGuardService.canActivate();
		expect(roleGuardService.canActivate()).toBe(true);
	});
});
