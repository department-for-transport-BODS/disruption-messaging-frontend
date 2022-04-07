import {
	ITransModelRestrictionsType,
	IRestrictionEnum,
	IOrganisationType,
	IRoleType,
	ITransModelRestrictionsObject, IUserInput
} from 'src/generated/graphql';
import { FormBuilder } from '@angular/forms';
import { UserMapper } from './user.mapper';
import { UserViewModel } from './user.viewmodel';

describe('UserMapper', () => {
	const formBuilder: FormBuilder = new FormBuilder();
	const userModel: UserViewModel = {
		id: '1',
		username: 'user-1',
		email: 'user@foo.com',
		organisation: { name: 'organisation-1', id: '1', created: '', modified: '' } as IOrganisationType,
		organisationDisplay: 'organisation-1',
		role: { name: 'Role', id: '1', created: '', modified: '' } as IRoleType,
		restrictedLines: [
			{
				entityId: 'L1',
				type: IRestrictionEnum.Line,
				featureName: 'featureName',
				boundingBox: '',
				name: 'Name',
				selected: false,
				operatorEntityIds: []
			}
		],
		restrictedOperators: [
			{
				entityId: 'O1',
				type: ITransModelRestrictionsType.Op,
				name: 'Op1',
				id: '121'
			} as ITransModelRestrictionsObject
		],
		roleDisplay: null
	};

	it('should map restricted lines and opertors', () => {
		const ops = [userModel.restrictedOperators];
		const lines = [userModel.restrictedLines];
		const formGroup = formBuilder.group({
			id: userModel.id,
			username: userModel.username,
			email: userModel.email,
			organisation: userModel.organisation,
			role: userModel.role,
			restrictedOperators: ops,
			restrictedLines: lines
		});

		const userMapper = new UserMapper;
		const result = userMapper.getMutationInput(formGroup);

		expect(result.transmodelRestrictions.length).toBe(2);
	});

	it('should map to transport view model', () => {});
});
