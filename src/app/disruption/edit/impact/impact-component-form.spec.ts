import { ImpactComponentForm } from './impact-component-form';
import {IDisruptionImpactDirection} from '../../../../generated/graphql';

describe('ImpactComponentForm', () => {
	beforeEach(() => {});

	const impact: any = {
		id: '23refsrewrwe',
		mode: 'Bus',
		advice: 'this is impact advice',
		journeyPlanners: true,
		delay: '33',
		severity: 'Severe',
		type: 'service',
		direction: IDisruptionImpactDirection.Clockwise,
		operators: ['Op'],
		lines: ['x1'],
		stops: ['1', '2']
	};

	it('should create form', () => {
		const form = new ImpactComponentForm();
		expect(form).toBeTruthy();
	});

	it('should patch values form', () => {
		const patched = ImpactComponentForm.patchedValues(impact, false);

		expect(patched.id).toBe(impact.id);
		expect(patched.mode[0]).toBe(impact.mode);
		expect(patched.advice[0]).toBe(impact.advice);
		expect(patched.journeyPlanners[0]).toBe(impact.journeyPlanners);
		expect(patched.delay[0]).toBe(impact.delay);
		expect(patched.severity[0]).toBe(impact.severity);
		expect(patched.direction[0]).toBe(impact.direction);
		expect(patched.type[0]).toBe(impact.type);
		expect(patched.operators[0]).toBe(impact.operators);
		expect(patched.lines[0]).toBe(impact.lines);
		expect(patched.stops[0]).toBe(impact.stops);
	});

	it('should not patch id, line or operator for similar impact', () => {
		const patched = ImpactComponentForm.patchedValues(impact, true);

		expect(patched.id).toBe('');
	});
});
