import {
	IDisruptionNode,
	IDisruptionNodeConnection,
	IDisruptionNodeEdge,
	IValidityPeriodType
} from 'src/generated/graphql';
import * as moment from 'moment';
import {
	IDisruptionReason,
	IDisruptionStatus,
	IDisruptionType,
	IDisruptionImpactMode,
	IHootSuiteProfileProfileType
} from 'src/generated/enum-overrides';
import { IEditDisruptionViewModel } from './edit-disruption.view.model';
import { DisruptionViewModelsTestBuilder } from 'src/app/shared/disruption-mapper/disruption-viewmodels.test-builder';
import { IEditDisruptionViewModelMapper } from './edit-disruption.view-model.mapper';
import { IAutoCompleteDisruptionsMapper } from './overview/autocomplete-disruptions/autocomplete-disruptions.mapper';
import { SocialAccountViewModelMapper } from 'src/app/social/social.view-model.mapper';

describe('EditDisruptionViewModelMapper', () => {
	const mapper: IEditDisruptionViewModelMapper = new IEditDisruptionViewModelMapper(
		new IAutoCompleteDisruptionsMapper(),
		new SocialAccountViewModelMapper()
	);
	const relatedNode: IDisruptionNode = {
		id: 'RGlzcnVwdGlvbk5vZGU6Nw==',
		title: 'related_title',
		status: IDisruptionStatus.A_4,
		created: null,
		createdBy: null,
		deleted: false,
		isTemplate: false,
		modified: null,
		version: 0,
		reason: null,
		type: null,
		isOpenEnded: true
	} as IDisruptionNode;

	const edge: IDisruptionNodeEdge = {
		cursor: '',
		node: relatedNode
	};

	const relatedDisruptions: IDisruptionNodeConnection = {
		pageInfo: null,
		edges: [edge]
	};

	const validityPeriods: IValidityPeriodType[] = [
		{
			id: '1',
			startDate: '2019-07-15',
			endDate: '2019-07-16',
			startTime: '11:11:00',
			endTime: '22:22:00',
			disruption: null
		},
		{
			id: '2',
			startDate: '2019-07-08',
			endDate: '2019-07-09',
			startTime: '01:01:00',
			endTime: '02:02:00',
			disruption: null
		}
	];

	const node: IDisruptionNode = {
		id: 'RGlzcnVwdGlvbk5vZGU6MTM5NQ==',
		title: 'This is my test disruption',
		description: 'A longer description that should be mapped',
		link: 'http://link.com',
		type: IDisruptionType.A_2,
		reason: IDisruptionReason.A_1,
		publishingStart: '2019-07-06T01:00:00+00:00',
		publishingEnd: '2019-07-10T01:00:00+00:00',
		relatedDisruption: relatedDisruptions,
		validityPeriod: validityPeriods,
		// fields that needed for type.
		status: IDisruptionStatus.A_4,
		created: null,
		createdBy: null,
		deleted: false,
		isTemplate: false,
		modified: null,
		version: 0,
		isOpenEnded: false
	} as IDisruptionNode;

	describe('should map to view model', () => {
		it('should map id from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.id).toBe(node.id);
		});

		it('should map decoded id from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			// slight magic string but 1395 is the decoded value of the id.
			expect(viewModel.decodedId).toBe('1395');
		});

		it('should map isTemplate from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.isTemplate).toBe(node.isTemplate);
		});

		it('should map isTemplate from node as true', () => {
			node.isTemplate = true;
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.isTemplate).toBe(node.isTemplate);
		});

		it('should map summary from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.summary).toBe(node.title);
		});

		it('should map description from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.description).toBe(node.description);
		});

		it('should map link from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.link).toBe(node.link);
		});

		it('should map type from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.disruptionType).toBe(IDisruptionType[node.type]);
		});

		it('should map reason from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.reason).toBe(IDisruptionType[node.reason]);
		});

		it('should map publishing start from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.publishingStart).toEqual(moment.utc(node.publishingStart).local());
		});

		it('should map publishing end from node', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.publishingEnd).toEqual(moment.utc(node.publishingEnd).local());
		});

		it('should map publishing range as null from node when empty', () => {
			const differentNode: IDisruptionNode = {
				id: 'RGlzcnVwdGlvbk5vZGU6MTM5NQ==',
				title: 'This is my test disruption',
				description: 'A longer description that should be mapped',
				link: 'http://link.com',
				type: IDisruptionType.A_2,
				reason: IDisruptionReason.A_1,
				publishingStart: null,
				publishingEnd: null,
				relatedDisruption: relatedDisruptions,
				validityPeriod: validityPeriods,
				// fields that needed for type.
				status: IDisruptionStatus.A_4,
				created: null,
				createdBy: null,
				deleted: false,
				isTemplate: false,
				modified: null,
				version: 0,
				isOpenEnded: false
			} as IDisruptionNode;

			const viewModel = mapper.toEditDisruptionViewModel(differentNode);
			expect(viewModel.publishingStart).toEqual(null);
			expect(viewModel.publishingEnd).toEqual(null);
		});

		it('should map related disruptions', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.related).toEqual([{ id: 'RGlzcnVwdGlvbk5vZGU6Nw==', title: 'related_title (7)' , deleted: false}]);
		});

		it('should map validity periods', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			const vps = viewModel.validityPeriods;

			const vpOneStart = moment.utc('2019-07-15T11:11:00', 'YYYY-MM-DDTHH:mm:ss').local();
			const vpOneEnd = moment.utc('2019-07-16T22:22:00', 'YYYY-MM-DDTHH:mm:ss').local();
			const vpTwoStart = moment.utc('2019-07-08T01:01:00', 'YYYY-MM-DDTHH:mm:ss').local();
			const vpTwoEnd = moment.utc('2019-07-09T02:02:00', 'YYYY-MM-DDTHH:mm:ss').local();

			expect(vps[0].id).toEqual(node.validityPeriod[0].id);
			expect(vps[0].startDate).toEqual(vpOneStart);
			expect(vps[0].endDate).toEqual(vpOneEnd);
			expect(vps[1].id).toEqual(node.validityPeriod[1].id);
			expect(vps[1].startDate).toEqual(vpTwoStart);
			expect(vps[1].endDate).toEqual(vpTwoEnd);
		});
	});

	describe('should map impacts from node to view model', () => {
		const nodeWithImpact = new DisruptionViewModelsTestBuilder().createIDisruptionNode();
		let viewModelWithImpact: IEditDisruptionViewModel;
		beforeAll(() => {
			viewModelWithImpact = mapper.toEditDisruptionViewModel(nodeWithImpact);
		});

		it('should map empty impacts to empty list', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.impacts).toBeFalsy();
		});

		it('should map impact from impact node', () => {
			expect(viewModelWithImpact.impacts.length).toBe(1);
		});

		it('should map impact id from impact node', () => {
			expect(viewModelWithImpact.impacts[0].id).toBe(nodeWithImpact.impact.edges[0].node.id);
		});

		it('should map impact advice from impact node', () => {
			expect(viewModelWithImpact.impacts[0].advice).toBe(nodeWithImpact.impact.edges[0].node.advice);
		});

		it('should map impact delay from impact node', () => {
			expect(viewModelWithImpact.impacts[0].delay).toBe(nodeWithImpact.impact.edges[0].node.delay);
		});

		it('should map impact journeyPlanner from impact node', () => {
			expect(viewModelWithImpact.impacts[0].journeyPlanners).toBeTruthy();
		});

		it('should map impact mode from impact node', () => {
			expect(viewModelWithImpact.impacts[0].mode).toBe(
				IDisruptionImpactMode[nodeWithImpact.impact.edges[0].node.mode]
			);
		});

		it('should map impact severity from impact node', () => {
			expect(viewModelWithImpact.impacts[0].severity).toBe('VerySevere');
		});
	});

	describe('should map social messages from node to view model', () => {
		const nodeWithMessages = new DisruptionViewModelsTestBuilder().createIDisruptionNode();
		const nodeWithHootSuiteMessages = new DisruptionViewModelsTestBuilder().createIDisruptionNodeWithHootSuiteProfile();
		let vmWithMessages: IEditDisruptionViewModel;
		let vmWithHootSuite: IEditDisruptionViewModel;
		beforeAll(() => {
			vmWithMessages = mapper.toEditDisruptionViewModel(nodeWithMessages);
			vmWithHootSuite = mapper.toEditDisruptionViewModel(nodeWithHootSuiteMessages)
		});

		it('should map empty social messages to empty list', () => {
			const viewModel = mapper.toEditDisruptionViewModel(node);
			expect(viewModel.socialMessages).toEqual([]);
		});

		it('should map social messages from node', () => {
			expect(vmWithMessages.socialMessages.length).toBe(1);
		});

		it('should map social messages id from node', () => {
			expect(vmWithMessages.socialMessages[0].id).toBe(nodeWithMessages.socialMessages[0].id);
		});

		it('should map social messages username from node', () => {
			expect(vmWithMessages.socialMessages[0].socialAccount.username).toBe(
				nodeWithMessages.socialMessages[0].socialAccount.username
			);
		});

		it('should map social messages email from node', () => {
			expect(vmWithMessages.socialMessages[0].socialAccount.email).toBe(
				nodeWithMessages.socialMessages[0].socialAccount.email
			);
		});

		it('should map social messages message from node', () => {
			expect(vmWithMessages.socialMessages[0].text).toBe(nodeWithMessages.socialMessages[0].message);
		});

		it('should map social messages publish on from node', () => {
			expect(vmWithMessages.socialMessages[0].publishOn.toISOString).toEqual(
				moment('2019-07-12T23:00').toISOString
			);
		});

		it('should map social messages published on from node', () => {
			expect(vmWithMessages.socialMessages[0].publishedOn.toISOString).toEqual(
				moment('2019-07-12T23:01').toISOString
			);
		});

		it('should map social messages published from node', () => {
			expect(vmWithMessages.socialMessages[0].published).toBeTruthy();
		});

		it('should map social messages last published error from node', () => {
			expect(vmWithMessages.socialMessages[0].lastPublishedError).toBe(null);
		});

		it('should map hootsuite profile', () => {
			expect(vmWithHootSuite.socialMessages[0].hootSuiteProfile).toEqual({
				id: '1',
				profileType: IHootSuiteProfileProfileType.A_1,
				socialUsername: null,
				socialId: '123456789',
				socialMessages: null,
				profileId: '1234'
			});
		});
	});
});
