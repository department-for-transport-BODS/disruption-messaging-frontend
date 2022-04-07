import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStoreService } from './user.store.service';
import { Router } from '@angular/router';
import { ApolloTestingModule } from 'apollo-angular/testing';

const mockRouter = {
	navigate: jasmine.createSpy('navigate')
};

const mockUserStore = {
	isAuthenticated: jasmine.createSpy('isAuthenticated')
};

let authGuardService: AuthGuardService;

describe('AuthGuardService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, ApolloTestingModule],
			providers: [
				AuthGuardService,
				{ provide: UserStoreService, useValue: mockUserStore },
				{ provide: Router, useValue: mockRouter }
			]
		})
	);

	beforeEach(() => {
		authGuardService = TestBed.get(AuthGuardService);
	});

	it('should be route to login when not authenticated', () => {
		mockUserStore.isAuthenticated.and.returnValue(false);

		authGuardService.canActivate();
		expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
	});

	it('should be return true when authenticated', () => {
		mockUserStore.isAuthenticated.and.returnValue(true);

		authGuardService.canActivate();
		expect(authGuardService.canActivate()).toBe(true);
	});
});
