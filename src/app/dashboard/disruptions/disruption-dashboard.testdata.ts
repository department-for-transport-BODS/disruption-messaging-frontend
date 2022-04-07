import {
	IDisruptionImpactNode,
	IDisruptionNodeConnection,
	IDisruptionStatsType,
	IStopPointNode,
	IValidityPeriodRepetition
} from '../../../generated/graphql';
import * as moment from 'moment';
import {IDisruptionImpactMode, IDisruptionImpactSeverity, IDisruptionStatus, IDisruptionType} from '../../../generated/enum-overrides';

export const disruptionStatsRes: IDisruptionStatsType = {
		__typename:  'DisruptionStatsType',
		liveDisruptions: {
			totalCount: 1,
			edges: [{
				node: {
					id: 'MQ==',
					title: 'A live disruption',
					status: IDisruptionStatus.A_3,
					severity: IDisruptionImpactSeverity.A_3,
					description: 'A disruption',
					validityPeriod: [{
						id: '1234',
						startDate: moment.now().toString(),
						endDate: moment.now().toString(),
						days: null,
						startTime: moment.now().toString(),
						endTime: moment.now().toString(),
						repetition: IValidityPeriodRepetition.Daily,
						finalDate: moment.now().toString(),
					}],
					impact: {
						edges: [{
							node: {
								id: 'MQ==',
								severity: IDisruptionImpactSeverity.A_3,
								name: 'Name',
								mode: IDisruptionImpactMode.A_1,
								operators: null,
								lines: null,
								stops: {
									edges: [{
										node: {
											id: '1',
											commonName: 'A stop',
											latitude: 12.23,
											longitude: 12.23
										} as IStopPointNode
									}]
								}
							} as IDisruptionImpactNode
						}]
					}
				}
			}]
		} as IDisruptionNodeConnection,
		upcomingDisruptions: {
			totalCount: 1,
			edges: [{
				node: {
					id: 'Mg==',
					title: 'An upcoming disruption',
					status: IDisruptionStatus.A_3,
					severity: IDisruptionImpactSeverity.A_3,
					description: 'A disruption',
					validityPeriod: [{
						id: '1234',
						startDate: moment.now().toString(),
						endDate: moment.now().toString(),
						days: null,
						startTime: moment.now().toString(),
						endTime: moment.now().toString(),
						repetition: IValidityPeriodRepetition.Daily,
						finalDate: moment.now().toString(),
					}],
					impact: {
						edges: [{
							node: {
								id: 'Mg==',
								severity: IDisruptionImpactSeverity.A_3,
								name: 'Name',
								mode: IDisruptionImpactMode.A_1,
								operators: null,
								lines: null,
								stops: {
									edges: [{
										node: {
											id: '2',
											commonName: 'A stop',
											latitude: 12.23,
											longitude: 12.23
										} as IStopPointNode
									}]
								}
							} as IDisruptionImpactNode
						}]
					}
				}
			}]
		} as IDisruptionNodeConnection,
	} as IDisruptionStatsType;
