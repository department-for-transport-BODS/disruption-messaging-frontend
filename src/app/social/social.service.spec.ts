import { TestBed, flush, fakeAsync } from '@angular/core/testing';
import { SocialService } from './social.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialAccountViewModelMapper } from './social.view-model.mapper';
import { ISocialAccountViewModel } from './social.view.model';
import { ISocialRegistrationAccountType } from 'src/generated/enum-overrides';
import { ISocialAccountAccountType, ISocialAccountEnum, ISocialRegistrationInput } from 'src/generated/graphql';
import { skip } from 'rxjs/operators';

describe('SocialService', () => {
	let service: SocialService;
	let controller: ApolloTestingController;
	let viewModelMapper: SocialAccountViewModelMapper;

	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AngularSvgIconModule, ApolloTestingModule, HttpClientModule, RouterTestingModule],
			declarations: [],
			providers: [SocialService]
		}).compileComponents()
	);

	beforeEach(() => {
		controller = TestBed.get(ApolloTestingController);
		service = TestBed.get(SocialService);
		viewModelMapper = TestBed.get(SocialAccountViewModelMapper);
	});

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
		isHootSuite: false,
		hootSuiteProfiles: null
	};

	const account: any = {
		username: 'newTest',
		email: 'a@b.com',
		accountType: ISocialAccountAccountType.A_1,
		prettyName: '@tester',
		id: '1',
		createdBy: { id: '1', username: 'Test', organisation: {id: '1', name: 'organisation'} },
		facebookPages: {
			id: '1',
			name: 'page2'
		},
		tokenExpiresAt: 5355,
		hootsuiteProfiles: null
	};

	it('should get all social accounts', done => {
		spyOn(viewModelMapper, 'getModel').and.returnValue(viewModel);

		service.socialAccounts$().subscribe(acc => {
			expect(acc[0]).toBe(viewModel);
			expect(acc.length).toBe(1);
			done();
		});

		controller.expectOne('allSocialAccounts').flush({
			data: { allSocialAccounts: [account] }
		});
		controller.verify();
	});

	it('should register social accounts', fakeAsync(() => {
		service.registerAccount(ISocialAccountEnum.Twitter);

		const input: ISocialRegistrationInput = {
			accountType: ISocialAccountEnum.Twitter
		};
		const mutation = controller.expectOne('registerSocialAccount');
		expect(mutation.operation.variables.params).toEqual(input);
		mutation.flush({
			data: {
				registerSocialAccount: {
					success: true,
					errors: null,
					data: { authorizeUrl: 'http://fakeurl' }
				}
			}
		});
		flush();
		service.authorizedUrl$.subscribe(url => {
			expect(url).toEqual('http://fakeurl');
		});
		flush();
		controller.expectOne('allSocialAccounts').flush({
			data: { allSocialAccounts: [account] }
		});
		flush();
		controller.verify();
	}));

	it('should remove social account', fakeAsync(() => {
		const id = '4';
		service.deleteAccount(id);
		flush();

		const mutation = controller.expectOne('deleteSocialAccount');
		expect(mutation.operation.variables.id).toEqual(4);
		mutation.flush({
			data: {
				deleteSocialAccount: {
					success: true,
					errors: null
				}
			}
		});
		flush();
		controller.expectOne('allSocialAccounts').flush({
			data: { allSocialAccounts: [account] }
		});

		service.deleteSuccess$.pipe(skip(1)).subscribe(success => {
			expect(success).toBeTruthy();
		});
		flush();
		controller.verify();
	}));
});
