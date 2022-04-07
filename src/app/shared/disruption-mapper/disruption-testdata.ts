export const disruption = {
	id: 'RGlzcnVwdGlvbk5vZGU6NjM=',
	title: 'Tram 26 not running in Liverpool City Centre',
	createdBy: {
		username: 'test_uer',
		id: '1'
	},
	isTemplate: false,
	status: 'A_3',
	severity: 'Normal',
	isLive: true,
	description: 'Debris on track means MerseyTram 26 cannot complete journeys westwards',
	isOpenEnded: true,
	impact: {
		edges: [
			{
				node: {
					id: 'RGlzcnVwdGlvbkltcGFjdE5vZGU6Mzc=',
					name: 'MerseyTram 26',
					severity: '_100',
					mode: 'A_2',
					delay: 1,
					operators: {
						edges: [
							{
								node: {
									id: 'T3BlcmF0b3JOb2RlOjUy',
									name: 'Stagecoach Tram'
								}
							}
						]
					},
					lines: {
						edges: [
							{
								node: {
									id: 'TGluZU5vZGU6NjM=',
									name: '26'
								}
							}
						]
					},
					stops: {
						edges: [
							{
								node: {
									id: 'U3RvcFBvaW50Tm9kZTo0NA==',
									commonName: 'Mersey road'
								}
							}
						]
					}
				}
			}
		]
	},
	reason: 'A_11',
	validityPeriod: [
		{
			id: '60',
			startDate: '2019-07-03',
			endDate: '2019-07-04',
			startTime: '06:00:00',
			endTime: '18:00:00',
			finalDate: '2019-07-04',
			repetition: 'DAILY',
			days: []
		}
	]
};

export const allDisruptions = {
	totalCount: 25,
	pageInfo: {
		hasNextPage: true,
		endCursor: 'YXJyYXljb25uZWN0aW9uOjA='
	},
	edges: [
		{
			node: {
				id: 'RGlzcnVwdGlvbk5vZGU6NjM=',
				title: 'Tram 26 not running in Liverpool City Centre',
				description: 'Debris on track means MerseyTram 26 cannot complete journeys westwards',
				status: 'A_3',
				version: 1,
				link: 'testlink.com',
				severity: 'Normal',
				isLive: true,
				createdBy: {
					username: 'testuer'
				},
				type: 'Planned',
				isTemplate: false,
				relatedDisruption: {edges: []},
				organisation: {
					id: 1,
					name: 'TestOrganisation'
				},
				isOpenEnded: false,
				openSince: '2019-01-01T00:00:00+00:00',
				deleted: false,
				reason: 'A_117',
				approvedBy: {
					username: 'testuser'
				},
				relatedTo: {
					edges: []
				},
				publishingStart: '2019-05-05T00:00:00+00:00',
				publishingEnd: '2019-10-10T23:59:00+00:00',
				impact: {
					edges: [
						{
							node: {
								id: 'RGlzcnVwdGlvbkltcGFjdE5vZGU6Mzc=',
								name: 'MerseyTram 26',
								advice: 'Test advice',
								severity: '_100',
								delay: 12,
								journeyPlanner: true,
								direction: 'ANTI_CLOCKWISE',
								mode: 'A_2',
								operators: null,
								allOperators: false,
								lines: {
									edges: [{ node: { id: '1', name: '1', ref: '23' } }]
								},
								stops: {
									edges: [
										{
											node: { id: 'id', commonName: 'common', atcoCode: 'ATCO1234', naptanCode: null }
										}
									]
								}
							}
						}
					]
				},
				validityPeriod: [
					{
						startDate: '2019-07-03',
						endDate: '2019-07-04',
						startTime: '06:00:00',
						endTime: '18:00:00',
						finalDate: '2019-07-04',
						repetition: 'DAILY',
						days: []
					}
				],
				socialMessages: [],
			}
		}
	]
};


export const allDisruptionFields = {
	totalCount: 25,
	pageInfo: {
		hasNextPage: true,
		endCursor: 'YXJyYXljb25uZWN0aW9uOjA='
	},
	edges: [
		{
			node: {
				id: 'RGlzcnVwdGlvbk5vZGU6NjM=',
				title: 'Tram 26 not running in Liverpool City Centre',
				description: 'Debris on track means MerseyTram 26 cannot complete journeys westwards',
				version: 1,
				link: 'testlink.com',
				status: 'A_3',
				severity: 'Normal',
				isLive: true,
				createdBy: {
					username: 'testuer'
				},
				type: 'Planned',
				isTemplate: false,
				relatedDisruption: {edges: []},
				organisation: {
					id: 1,
					name: 'TestOrganisation'
				},
				isOpenEnded: false,
				openSince: '2019-01-01T00:00:00+00:00',
				deleted: false,
				reason: 'A_117',
				approvedBy: {
					username: 'testuser'
				},
				relatedTo: {
					edges: []
				},
				publishingStart: '2019-05-05T00:00:00+00:00',
				publishingEnd: '2019-10-10T23:59:00+00:00',

				impact: {
					edges: [
						{
							node: {
								id: 'RGlzcnVwdGlvbkltcGFjdE5vZGU6Mzc=',
								name: 'MerseyTram 26',
								advice: 'Test advice',
								severity: '_100',
								delay: 12,
								journeyPlanner: true,
								direction: 'ANTI_CLOCKWISE',
								allOperators: false,
								mode: 'A_2',
								operators: null,
								lines: {
									edges: [{ node: { id: '1', name: '1', ref: '23' } }]
								},
								stops: {
									edges: [
										{
											node: { id: 'id', commonName: 'common', atcoCode: 'ATCO1234', naptanCode: null }
										}
									]
								}
							} }
						],
				},
				validityPeriod: [
					{
						startDate: '2019-07-03',
						endDate: '2019-07-04',
						startTime: '06:00:00',
						endTime: '18:00:00',
						finalDate: '2019-07-04',
						repetition: 'DAILY',
						days: []
					}
				],
				socialMessages: [{
					id: 1,
					message: 'Test message',
					image: null,
					socialAccount: {
						id: 1,
						username: 'testusername',
						accountType: 'A_1',
						prettyName: 'pretty',
						email: 'testuser@test.com',
						createdBy: {
							username: 'user'
						},
						hootsuiteProfiles: {
							id: 1,
							account: {
								username: '123456'
							},
							profileType: 'A_1',
							profileId: '654321',
							socialId: '1234567890',
							socialUsername: null
						}
					},
					publishOn: '2020-10-21T06:00:14.829000+00:00',
					published: true,
					publishedOn: '2020-10-20T10:51:07.068830+00:00',
					lastPublishError: null
				}]
			}
		}
	]
};

