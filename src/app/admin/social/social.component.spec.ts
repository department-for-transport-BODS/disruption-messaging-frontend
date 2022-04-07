import { async, ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { SocialComponent } from './social.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { SocialAccountViewModelMapper } from 'src/app/social/social.view-model.mapper';
import { SocialService } from 'src/app/social/social.service';
import { ISocialAccountViewModel } from 'src/app/social/social.view.model';
import { ISocialRegistrationAccountType, IHootSuiteProfileProfileType } from 'src/generated/enum-overrides';
import { cold } from 'jasmine-marbles';
import { ISocialAccountEnum } from 'src/generated/graphql';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ILocalStorage } from './social.localstorage.enum';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSmartModalService, NgxSmartModalModule } from 'ngx-smart-modal';
import Timeout = NodeJS.Timeout;
import { TableComponent } from '../../shared/components/table/table.component';
import { By } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { TableButtonsParentComponent } from '../../shared/components/table/table-buttons.parent.component';
import { HootSuiteCellRenderer } from './hootsuite-profile.cell.component';

describe('SocialComponent', () => {
	let component: SocialComponent;
	let gridComponent: TableComponent;
	let fixture: ComponentFixture<SocialComponent>;
	let controller: ApolloTestingController;
	let mapper: SocialAccountViewModelMapper;
	let socialService: SocialService;
	let modalService: NgxSmartModalService;
	let intervalId: Timeout;
	let gridReady: boolean;

	const mockModal = jasmine.createSpyObj('modal', ['open', 'close']);
	const mockLocation = {
		replaceState: jasmine.createSpy('replaceState'),
		subscribe: jasmine.createSpy()
	};

	const viewModel: ISocialAccountViewModel = {
		accountType: ISocialRegistrationAccountType.A_1,
		createdBy: 'Test',
		displayName: '@tester',
		email: 'a@b.com',
		name: 'test view model',
		prettyName: '@tester',
		username: 'newTest',
		organisation: 'organisation',
		expiresIn: 'a day',
		hootSuiteProfiles: null,
		isHootSuite: false
	};

	const hootSuiteViewModel: ISocialAccountViewModel = {
		accountType: ISocialRegistrationAccountType.A_3,
		createdBy: 'Test',
		displayName: '@tester',
		email: 'a@b.com',
		name: 'test view model',
		prettyName: '@tester',
		username: 'newTest',
		organisation: 'organisation',
		expiresIn: 'Never',
		hootSuiteProfiles: [{
			id: '1',
			profileId: '1234',
			profileType: IHootSuiteProfileProfileType.A_1,
			socialId:  '4567890',
			socialUsername: null,
			socialMessages: null,
		}, {
			id: '2',
			profileId: '1234',
			profileType: IHootSuiteProfileProfileType.A_2,
			socialId:  '4567890',
			socialUsername: 'Page Test',
			socialMessages: null
		}],
		isHootSuite: true
	};

	describe('Query params for error', () => {
		const queryParams = { error: 'invalid request', tab: 'social' };
		const mockActivatedRoute = { snapshot: { queryParams } };

		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					SharedModule,
					ApolloTestingModule,
					RouterTestingModule,
					HttpClientTestingModule,
					NgxSmartModalModule.forRoot()],
				declarations: [SocialComponent],
				providers: [
					{ provide: ActivatedRoute, useValue: mockActivatedRoute },
					{ provide: Location, useValue: mockLocation },
				]
			}).compileComponents();

			controller = TestBed.get(ApolloTestingController);
			socialService = TestBed.get(SocialService);
			mapper = TestBed.get(SocialAccountViewModelMapper);

			const accountList = cold('--a|', { a: [viewModel] });
			spyOn(socialService, 'socialAccounts$').and.returnValue(accountList);
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(SocialComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should display callback error', () => {
			localStorage.setItem(ILocalStorage.PendingRequest, 'true');
			component.ngOnInit();
			fixture.detectChanges();

			const banner = fixture.nativeElement.querySelector('.banner--error');
			expect(banner.textContent).toEqual('invalid request');
		});
	});

	describe('Query params for success', () => {
		const queryParams = { success: 'true' };
		const mockActivatedRoute = { snapshot: { queryParams } };

		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					SharedModule,
					ApolloTestingModule,
					HttpClientTestingModule,
					NgxSmartModalModule.forRoot(),
					RouterTestingModule,
				],
				declarations: [SocialComponent],
				providers: [
					{ provide: ActivatedRoute, useValue: mockActivatedRoute },
					{ provide: Location, useValue: mockLocation }
				]
			}).compileComponents();

			controller = TestBed.get(ApolloTestingController);
			socialService = TestBed.get(SocialService);
			mapper = TestBed.get(SocialAccountViewModelMapper);

			const accountList = cold('--a|', { a: [viewModel] });
			spyOn(socialService, 'socialAccounts$').and.returnValue(accountList);
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(SocialComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should display success message', () => {
			localStorage.setItem(ILocalStorage.AccountType, 'Twitter');
			localStorage.setItem(ILocalStorage.PendingRequest, 'true');

			component.ngOnInit();
			fixture.detectChanges();

			const banner = fixture.nativeElement.querySelector('.banner--success');
			expect(banner.textContent).toEqual('Account for Twitter successfully connected');
		});

		it('should clear success message after timeout', fakeAsync(() => {
			localStorage.setItem(ILocalStorage.AccountType, 'Twitter');
			localStorage.setItem(ILocalStorage.PendingRequest, 'true');

			component.ngOnInit();
			fixture.detectChanges();

			const banner = fixture.nativeElement.querySelector('.banner--success');
			expect(banner.textContent).toEqual('Account for Twitter successfully connected');

			tick(6001);
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('.banner--success')).toBe(null);
		}));
	});

	describe('Empty query params', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					SharedModule,
					ApolloTestingModule,
					HttpClientTestingModule,
					RouterTestingModule,
					NgxSmartModalModule.forRoot(),
					AgGridModule.withComponents([TableButtonsParentComponent, HootSuiteCellRenderer]),
				],
				declarations: [SocialComponent, HootSuiteCellRenderer],
				providers: [
					{ provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
					{ provide: Location, useValue: mockLocation }
				]
			}).compileComponents();

			controller = TestBed.get(ApolloTestingController);
			socialService = TestBed.get(SocialService);
			mapper = TestBed.get(SocialAccountViewModelMapper);
			modalService = TestBed.get(NgxSmartModalService);

			const accountList = cold('--a|', { a: [viewModel] });
			spyOn(socialService, 'socialAccounts$').and.returnValue(accountList);
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(SocialComponent);
			component = fixture.componentInstance;
			gridComponent = fixture.debugElement.query(By.directive(TableComponent)).context;
			fixture.detectChanges();
		});

		beforeEach(async (done) => {
			intervalId = setInterval(() => {
					if (gridComponent.gridApi) {
						gridReady = true;
						done();
					}
				}, 500);
		});

		it('should display table for social accounts', () => {
			const card = fixture.nativeElement.querySelector('dm-table');
			expect(card).toBeTruthy();
		});

		it('should load social account list', fakeAsync(() => {
			component.socialAccounts$.subscribe(() => {
				fixture.detectChanges();
				const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
				expect(cellElements.length).toEqual(6);
				expect(cellElements[0].textContent).toBe('Twitter');
				expect(cellElements[1].textContent).toBe('@tester');
				expect(cellElements[2].textContent).toBe('Test');
				expect(cellElements[3].textContent).toBe('a day');
			});
			flush();
		}));

		it('should not show any banner', () => {
			component.ngOnInit();

			const successBanner = fixture.nativeElement.querySelector('.banner--success');
			const errorBanner = fixture.nativeElement.querySelector('.banner--success');

			expect(successBanner).toBe(null);
			expect(errorBanner).toBe(null);
		});

		it('should call register account on connectFacebook', () => {
			spyOn(socialService, 'registerAccount');

			component.connectFacebook();

			expect(socialService.registerAccount).toHaveBeenCalledWith(ISocialAccountEnum.Facebook);
		});

		it('should call register account on connectTwitter', () => {
			spyOn(socialService, 'registerAccount');

			component.connectTwitter();

			expect(socialService.registerAccount).toHaveBeenCalledWith(ISocialAccountEnum.Twitter);
		});

		it('should call service to delete account', fakeAsync(() => {
			spyOn(socialService, 'deleteAccount');
			const deleteSuccess = cold('ab|', { a: null, b: true });
			spyOnProperty(socialService, 'deleteSuccess$').and.returnValue(deleteSuccess);
			spyOn(modalService, 'getModal').and.returnValue(mockModal);

			component.onDeleteButton('123');
			component.onOK();

			expect(socialService.deleteAccount).toHaveBeenCalledWith('123');

			deleteSuccess.subscribe(s => {
				component.callbackStatus = 'success';
				component.callbackMessage = 'Account successfully removed';
			});
			flush();
		}));

		it('should close the delete modal on cancel', () => {
			spyOn(modalService, 'getModal').and.returnValue(mockModal);

			component.onCancel();

			expect(modalService.getModal).toHaveBeenCalledTimes(1);
			expect(mockModal.close).toHaveBeenCalledTimes(1);
		});
	});

	describe('HootSuite account', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					SharedModule,
					ApolloTestingModule,
					HttpClientTestingModule,
					RouterTestingModule,
					NgxSmartModalModule.forRoot(),
					AgGridModule.withComponents([TableButtonsParentComponent, HootSuiteCellRenderer]),
				],
				declarations: [SocialComponent, HootSuiteCellRenderer],
				providers: [
					{ provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
					{ provide: Location, useValue: mockLocation }
				]
			}).compileComponents();

			controller = TestBed.get(ApolloTestingController);
			socialService = TestBed.get(SocialService);
			mapper = TestBed.get(SocialAccountViewModelMapper);
			modalService = TestBed.get(NgxSmartModalService);

			const accountList = cold('--a|', { a: [hootSuiteViewModel] });
			spyOn(socialService, 'socialAccounts$').and.returnValue(accountList);
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(SocialComponent);
			component = fixture.componentInstance;
			gridComponent = fixture.debugElement.query(By.directive(TableComponent)).context;
			fixture.detectChanges();
		});

		beforeEach(async (done) => {
			intervalId = setInterval(() => {
					if (gridComponent.gridApi) {
						gridReady = true;
						done();
					}
				}, 500);
		});

		it('should display table for social accounts', () => {
			const card = fixture.nativeElement.querySelector('dm-table');
			expect(card).toBeTruthy();
		});

		it('should load hootsuite account', fakeAsync(() => {
			component.socialAccounts$.subscribe(() => {
				fixture.detectChanges();
				const cellElements = fixture.nativeElement.querySelectorAll('.ag-cell-value');
				expect(cellElements.length).toEqual(6);
				expect(cellElements[0].textContent).toBe('HootSuite');
				expect(cellElements[1].textContent).toBe('@tester');
				expect(cellElements[2].textContent).toBe('Test');
				expect(cellElements[3].textContent).toBe('Never');
				if (cellElements.innerHTML) {
					expect(cellElements[4].innerHTML).toBe('<span><ul style="list-style-type:none; padding:0"><li><a href="https://twitter.com/i/user/4567890">Twitter/4567890...</a></li><li style="white-space:nowrap">Facebook/Page Test</li><ul></ul></ul></span>"');
				}
			});
			flush();
		}));

		it('should call register account on connectHootSuite', () => {
			spyOn(socialService, 'registerAccount');

			component.connectHootSuite();

			expect(socialService.registerAccount).toHaveBeenCalledWith(ISocialAccountEnum.HootSuite);
		});
	});

	afterEach(() => {
		localStorage.clear();
		mockModal.close.calls.reset();
	});
});
