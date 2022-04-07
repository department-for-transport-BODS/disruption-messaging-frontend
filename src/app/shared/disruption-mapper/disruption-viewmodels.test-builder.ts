import {
	IDisruptionNode,
	IDisruptionImpactNodeEdge,
	IDisruptionImpactNode,
	IPageInfo,
	IDisruptionImpactNodeConnection,
	IValidityPeriodType,
	IOperatorNode,
	ILineNode,
	ISocialMessageType,
	IValidityPeriodRepetition,
	IStopPointNodeConnection,
	ILineNodeConnection,
	IOperatorNodeConnection,
	ISocialAccountType,
	ISocialAccountAccountType,
	IUserType
} from 'src/generated/graphql';
import {
	IDisruptionStatus,
	IDisruptionType,
	IDisruptionReason,
	IDisruptionImpactSeverity,
	IDisruptionImpactCondition,
	IDisruptionImpactMode,
	IHootSuiteProfileProfileType
} from 'src/generated/enum-overrides';
import { DisruptionsGridModel } from '../../disruptions-list/grid/disruptions-grid.model';
import { DisruptionsGridRowViewModel } from '../../disruptions-list/grid/disruptions-gridrow.viewmodel';
import { DisruptionsGridMapper } from '../../disruptions-list/grid/disruptions-grid.mapper';

export class DisruptionViewModelsTestBuilder {
	private operators(name: string): IOperatorNodeConnection {
		return {
			edges: [
				{
					node: {
						id: '1',
						name,
						ref: '234fc'
					} as IOperatorNode
				}
			],
			pageInfo: {}
		} as IOperatorNodeConnection;
	}

	public impactNode(): IDisruptionImpactNode {
		return this.createImpactNode('', 1, '');
	}

	public createImpactNodeWithDelay(delay: number = 1): IDisruptionImpactNode {
		return this.createImpactNode('', delay, '');
	}

	public createImpactNodeWithOperator(operator: string): IDisruptionImpactNode {
		return this.createImpactNode('', 1, operator);
	}

	public createImpactNodeWithLine(line: string): IDisruptionImpactNode {
		return this.createImpactNode(line, 1, '');
	}

	private createImpactNode(line: string, delay: number, operatorName: string): IDisruptionImpactNode {
		return {
			id: 'RGlzcnVwdGlvbk5vZGU6MTMwMg==',
			lines: {
				edges: [
					{
						node: {
							id: '1',
							name: line,
							ref: ''
						} as ILineNode
					}
				],
				pageInfo: {}
			} as ILineNodeConnection,
			name: line,
			advice: '',
			delay,
			severity: 'A_1' as IDisruptionImpactSeverity,
			condition: 'A_1' as IDisruptionImpactCondition,
			journeyPlanner: false,
			direction: null,
			mode: 'A_1' as IDisruptionImpactMode,
			allOperators: false,
			deleted: false,
			operators: this.operators(operatorName),
			stops: {
				edges: [],
				pageInfo: {}
			} as IStopPointNodeConnection,
			created: null,
			modified: null,
		} as IDisruptionImpactNode;
	}

	public createIDisruptionNode(): IDisruptionNode {
		const impactNodeEdge: IDisruptionImpactNode = {
			id: 'RGlzcnVwdGlvbk5vZGU6MTM5NQ==',
			name: '',
			advice: 'this is the impact advice',
			delay: 1,
			severity: 'A_5' as IDisruptionImpactSeverity,
			condition: IDisruptionImpactCondition.A_1,
			journeyPlanner: false,
			direction: null,
			mode: 'A_1' as IDisruptionImpactMode,
			allOperators: false,
			deleted: false,
			operators: null,
			lines: {
				edges: [],
				pageInfo: {}
			} as ILineNodeConnection,
			stops: {
				edges: [],
				pageInfo: {}
			} as IStopPointNodeConnection,
			created: null,
			modified: null,
		} as IDisruptionImpactNode;

		const edges: Array<IDisruptionImpactNodeEdge> = [
			{
				cursor: '',
				node: impactNodeEdge
			}
		];

		const pageInfo: IPageInfo = {
			hasNextPage: false,
			hasPreviousPage: false
		};

		const impacts: IDisruptionImpactNodeConnection = {
			pageInfo,
			edges
		};

		const validityPeriods: IValidityPeriodType[] = [
			{
				id: '1',
				startDate: '2019-08-27T00:00:00',
				endDate: '2019-08-29T00:00:00',
				disruption: null,
				finalDate: '2019-08-30T00:00:00',
				repetition: IValidityPeriodRepetition.Daily
			},
			{
				id: '2',
				startDate: '2019-08-31T00:00:00',
				endDate: '2019-09-01T00:00:00',
				disruption: null,
				finalDate: null,
				repetition: IValidityPeriodRepetition.Daily
			}
		];

		const socialMessages: ISocialMessageType[] = [
			{
				socialAccount: {
					username: 'social-account-user',
					email: 'social-account-user@me.com',
					accountType: ISocialAccountAccountType.A_1,
					id: '1',
					hootsuiteProfiles: null,
					createdBy: {
						id: '1',
						username: 'org-admin',
						email: 'org-admin@foo.com',
						organisation: {
							name: 'org-1'
						}
					} as IUserType,
				} as ISocialAccountType,
				message: 'test message',
				image: null,
				published: true,
				publishOn: '2019-07-12T22:00:00',
				publishedOn: '2019-07-12T22:01:00',
				lastPublishError: null,
				id: '1',
				disruption: null
			}
		];

		return  {
			created: '',
			modified: '',
			id: 'RGlzcnVwdGlvbk5vZGU6MTM5NQ==',
			createdBy: { id: '1', email: 't@t.com', username: 'user' },
			title: 'Title of node',
			description: '',
			version: 1,
			status: IDisruptionStatus.A_1,
			type: IDisruptionType.A_2,
			reason: IDisruptionReason.A_17,
			isTemplate: false,
			publishingStart: '',
			publishingEnd: '',
			deleted: false,
			impact: impacts,
			validityPeriod: validityPeriods,
			socialMessages,
			isOpenEnded: false,
		} as IDisruptionNode;
	}

	public createIDisruptionNodeWithHootSuiteProfile(): IDisruptionNode {
		const disruptionNode = this.createIDisruptionNode()
		disruptionNode.socialMessages[0].hootsuiteProfile = {
			id: '1',
			profileType: IHootSuiteProfileProfileType.A_1,
			profileId: '1234',
			socialUsername: null,
			socialId: '123456789',
			socialMessages: null
		}
		return disruptionNode

	}

	public createGridModel(): DisruptionsGridModel {
		const dgMapper = new DisruptionsGridMapper();
		const node = this.createIDisruptionNode();
		const models: DisruptionsGridRowViewModel[] = [dgMapper.getRowModel(node), dgMapper.getRowModel(node)];

		return new DisruptionsGridModel(10, false, '', models);
	}
}
