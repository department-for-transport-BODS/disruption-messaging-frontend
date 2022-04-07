import { SocialAccountViewModelMapper } from './social.view-model.mapper';
import { ISocialRegistrationAccountType } from 'src/generated/graphql';

describe('socialViewModelMapper', () => {
	let apiResponse: any;
	const socialAccountViewModelMapper = new SocialAccountViewModelMapper();

	beforeEach(() => {
		apiResponse = {
			id: '123',
			username: 'new_user',
			email: 'test@email.com',
			accountType: 'A_2' as ISocialRegistrationAccountType,
			prettyName: 'prettyname',
			createdBy: { username: 'mcTest' },
			organisation: { name: 'org_name' },
			facebookPages: [{ name: 'page1', id: 'p1' }],
			tokenExpiresAt: 5183998
		};
	});

	it('should map id', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.id).toBe('123');
	});

	it('should map username', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.username).toBe('new_user');
	});

	it('should map email', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.email).toBe('test@email.com');
	});

	it('should map account type', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.accountType).toBe('Facebook');
	});

	it('should map account type for twitter', () => {
		apiResponse.accountType = 'A_1' as ISocialRegistrationAccountType;
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.accountType).toBe('Twitter');
	});

	it('should map account pretty name', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.prettyName).toBe('prettyname');
	});

	it('should map created by', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.createdBy).toBe('mcTest');
	});

	it('should map page name when facebook', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.pages).toBe('page1');
	});

	it('should map display name as page for fb', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.displayName).toBe('page1');
	});

	it('should map display name as pretty name for twitter', () => {
		apiResponse.accountType = 'A_1' as ISocialRegistrationAccountType;
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.displayName).toBe('prettyname');
	});

	it('should map token expiry', () => {
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.expiresIn).toBeTruthy();
	});

	it('should map token expiry to Never if account type is Hootsuite', () => {
		apiResponse.accountType = 'A_3';
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.expiresIn).toEqual('Never');
	});

	it('should map token expiry to Never if API returns undef expiry date', () => {
		apiResponse.tokenExpiresAt = null;
		const result = socialAccountViewModelMapper.getModel(apiResponse);
		expect(result.expiresIn).toEqual('Never');
	});
});
