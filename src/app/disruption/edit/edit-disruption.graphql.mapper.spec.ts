import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	IDisruptionDirectionEnum,
	IDisruptionImpactCreateInput,
	IDisruptionReasonInput,
	IDisruptionTypeInput,
	IModeInput,
	IRepetitionInput,
	ISeverityInput,
	ISocialAccountAccountType
} from 'src/generated/graphql';
import * as moment from 'moment';
import { OverviewComponentForm } from './overview/overview.component.form';
import { MessagingComponentForm } from './messaging/messaging-component-form';
import { IEditDisruptionGraphQLMapper } from './edit-disruption.graphql.mapper';
import { IDisruptionImpactDirectionReverse, ISocialRegistrationAccountType } from 'src/generated/enum-overrides';
import { ISocialAccountViewModel } from 'src/app/social/social.view.model';

describe('EditDisruptionGraphqlMapper', () => {
	const mapper: IEditDisruptionGraphQLMapper = new IEditDisruptionGraphQLMapper();
	const formBuilder: FormBuilder = new FormBuilder();

	describe('should map DisruptionForm to IDisruptionCreateInput', () => {
		let disruptionForm: FormGroup;
		let overviewForm: AbstractControl;

		beforeEach(() => {
			disruptionForm = formBuilder.group({
				id: new FormControl(''),
				overviewGroup: formBuilder.group(new OverviewComponentForm(formBuilder)),
				impactGroup: [[]],
				messagingGroup: [new MessagingComponentForm()]
			});
			overviewForm = disruptionForm.get('overviewGroup');
			overviewForm.patchValue({});
		});

		it('should map publishing start date', () => {
			const startInput = moment('22-06-2019', 'DD-MM-YYYY');
			overviewForm.patchValue({
				publishingStart: startInput
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.publishingStart).toBe(startInput.toISOString());
		});

		it('should map publishing end date', () => {
			const endDateInput = moment('22-06-2019', 'DD-MM-YYYY');
			overviewForm.patchValue({
				publishingEnd: endDateInput
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.publishingEnd).toBe(endDateInput.toISOString());
		});

		it('should map summary to title date', () => {
			const expectedVal = 'value';
			overviewForm.patchValue({
				summary: expectedVal
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.title).toBe(expectedVal);
		});

		it('should map description', () => {
			const expectedVal = 'value';
			overviewForm.patchValue({
				description: expectedVal
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.description).toBe(expectedVal);
		});

		it('should map link', () => {
			const expectedVal = 'value';
			overviewForm.patchValue({
				link: expectedVal
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.link).toBe(expectedVal);
		});

		it('should map type of disruption', () => {
			const expectedVal = IDisruptionTypeInput.Unplanned;
			overviewForm.patchValue({
				disruptionType: 'Unplanned'
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.type).toBe(expectedVal);
		});

		it('should map reason', () => {
			const expectedVal = IDisruptionReasonInput.RoadClosed;
			overviewForm.patchValue({
				reason: 'RoadClosed'
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.reason).toBe(expectedVal);
		});

		it('should map related disruptions', () => {
			const expectedVal = [{ id: '86' }];
			overviewForm.patchValue({
				related: [{ id: '86', title: 'snow' }]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.relatedDisruption).toEqual(expectedVal);
		});

		it('should map validity periods', () => {
			const overnightClosure = {
				startDate: '2019-08-03', // BST
				startTime: '20:29',
				endDate: '2019-08-04',
				endTime: '04:59',
				repetition: IRepetitionInput.Daily,
				finalDate: '2019-08-05'
			};
			const weekday = {
				startDate: '2019-10-30', // GMT
				startTime: '08:57',
				endDate: '2019-11-02',
				endTime: '16:30',
				id: '233',
				repetition: IRepetitionInput.Weekly,
				finalDate: '2019-12-02'
			};
			const vp = overviewForm.get('validityPeriods') as FormArray;

			vp.push(
				formBuilder.group({
					id: null,
					startDate: moment('2019-08-03T21:29'), // BST
					endDate: moment('2019-08-04T05:59'),
					repeats: 'Daily',
					ending: moment('2019-08-05T00:00:00')
				})
			);
			vp.push(
				formBuilder.group({
					id: '233',
					startDate: moment('2019-10-30T08:57'), // GMT
					endDate: moment('2019-11-02T16:30'),
					repeats: 'Weekly',
					ending: moment('2019-12-02T00:00:00')
				})
			);

			const model = mapper.toDisruptionInput(disruptionForm);

			expect(model.validityPeriod.length).toBe(2);
			expect(model.validityPeriod[0]).toEqual(overnightClosure);
			expect(model.validityPeriod[1]).toEqual(weekday);
		});

		it('should map impacts from form to graphql obj', () => {
			const impacts: IDisruptionImpactCreateInput[] = [
				{
					advice: 'this is advice which we can also use for name atm.',
					delay: 1,
					severity: ISeverityInput.Normal,
					journeyPlanner: true,
					direction: null,
					mode: IModeInput.Bus,
					lines: [],
					stops: [],
					operators: []
				}
			];
			const impactGroup = disruptionForm.get('impactGroup');
			impactGroup.setValue({
				impacts: [
					{
						id: '',
						advice: 'this is advice which we can also use for name atm.',
						delay: 1,
						severity: 'Normal',
						journeyPlanners: 'true',
						mode: 'Bus',
						type: 'Network',
						direction: null
					}
				]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.impact[0]).toEqual(impacts[0]);
			expect(model.impact.length).toEqual(1);
		});

		it('should map impact with id', () => {
			const impacts: IDisruptionImpactCreateInput[] = [
				{
					id: 'impact_1',
					advice: 'this is advice which we can also use for name atm.',
					delay: 1,
					severity: ISeverityInput.Normal,
					journeyPlanner: true,
					direction: IDisruptionDirectionEnum.Clockwise,
					mode: IModeInput.Bus,
					lines: [],
					stops: [],
					operators: []
				}
			];
			const impactGroup = disruptionForm.get('impactGroup');
			impactGroup.setValue({
				impacts: [
					{
						id: 'impact_1',
						advice: 'this is advice which we can also use for name atm.',
						delay: 1,
						severity: 'Normal',
						journeyPlanners: 'true',
						direction: IDisruptionImpactDirectionReverse.CLOCKWISE,
						mode: 'Bus'
					}
				]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.impact[0]).toEqual(impacts[0]);
			expect(model.impact.length).toEqual(1);
		});

		it('should map multiple impacts', () => {
			const impacts: IDisruptionImpactCreateInput[] = [
				{
					id: 'impact_1',
					advice: '',
					delay: 0,
					severity: ISeverityInput.Normal,
					journeyPlanner: false,
					direction: null,
					mode: IModeInput.Bus,
					operators: [{ ref: 'NA043', name: 'name' }],
					lines: [],
					stops: []
				},
				{
					id: 'impact_2',
					advice: 'more impacts this time',
					delay: 434,
					severity: ISeverityInput.VerySevere,
					journeyPlanner: true,
					mode: IModeInput.Ferry,
					direction: IDisruptionDirectionEnum.Anticlockwise,
					lines: [],
					stops: [],
					operators: []
				}
			];
			const impactGroup = disruptionForm.get('impactGroup');
			impactGroup.setValue({
				impacts: [
					{
						id: 'impact_1',
						advice: '',
						delay: 0,
						severity: 'Normal',
						journeyPlanners: 'false',
						direction: null,
						mode: 'Bus',
						type: 'Operator',
						operators: [{ name: 'name', entityId: 'NA043' }]
					},
					{
						id: 'impact_2',
						advice: 'more impacts this time',
						delay: 434,
						severity: 'VerySevere',
						journeyPlanners: 'true',
						direction: IDisruptionImpactDirectionReverse.ANTI_CLOCKWISE,
						mode: 'Ferry',
						type: 'Network'
					}
				]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.impact[0]).toEqual(impacts[0]);
			expect(model.impact[1]).toEqual(impacts[1]);
			expect(model.impact.length).toEqual(2);
		});

		it('should not fail when mapping with no impacts', () => {
			const impactGroup = disruptionForm.get('impactGroup');
			impactGroup.setValue({ impacts: [] });

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.impact).toEqual([]);
		});

		it('should not fail when no social messages', () => {
			const messagingGroup = disruptionForm.get('messagingGroup');
			messagingGroup.setValue({ messages: [] });

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.socialMessages).toEqual([]);
		});

		it('should map social messages', () => {
			const socialAccountViewModel: ISocialAccountViewModel  = {
				id: '1',
				accountType: ISocialRegistrationAccountType.A_1,
				hootSuiteProfiles: null,
				username: 'test'
			} as ISocialAccountViewModel;
			const messagingGroup = disruptionForm.get('messagingGroup');
			messagingGroup.setValue({
				messages: [
					{
						text: 'this is the message',
						socialAccount: socialAccountViewModel,
						publishOn: moment('2019-07-03T00:01')
					}
				]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.socialMessages.length).toEqual(1);
			expect(model.socialMessages[0].message).toEqual('this is the message');
			expect(model.socialMessages[0].socialAccount).toEqual({id: '1'});
			expect(model.socialMessages[0].publishOn).toEqual(moment('2019-07-03T00:01').toISOString());
		});

		it('should map hootsuite profile', () => {
			const messagingGroup = disruptionForm.get('messagingGroup');
			messagingGroup.setValue({
				messages: [
					{
						text: 'this is the message',
						socialAccount: {id: '1', isHootSuite: true},
						hootSuiteProfile: {id : '2'},
						publishOn: moment('2019-07-03T00:01')
					}
				]
			});

			const model = mapper.toDisruptionInput(disruptionForm);
			expect(model.socialMessages.length).toEqual(1);
			expect(model.socialMessages[0].message).toEqual('this is the message');
			expect(model.socialMessages[0].hootsuiteProfile).toEqual({id: '2'});
			expect(model.socialMessages[0].publishOn).toEqual(moment('2019-07-03T00:01').toISOString());
		});
	});
});
