import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { SettingsService } from './settings.service';
import { cold } from 'jasmine-marbles';
import { EnumValueViewModel } from './settings.viewmodel';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { FormsModule } from '@angular/forms';

describe('SettingsComponent', () => {
	let component: SettingsComponent;
	let service: SettingsService;
	let fixture: ComponentFixture<SettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SharedModule, CommonModule, DragDropModule, ApolloTestingModule, RouterTestingModule, OwlDateTimeModule,
				OwlMomentDateTimeModule, FormsModule],
			declarations: [SettingsComponent],
			providers: [SettingsService]
		}).compileComponents();
	}));

	const vms: EnumValueViewModel[] = [
		{
			type: 'Reason',
			allValues: ['Test', 'Another Test', 'anti Clockwise'],
			currentValues: []
		},
		{
			type: 'Severity',
			allValues: ['A Test', 'Unknown', 'More Values'],
			currentValues: ['A Test']
		}
	];

	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		service = TestBed.get(SettingsService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should subscribe to enums', fakeAsync(() => {
		const enums = cold('a', { a: vms });
		spyOn(service, 'enumValueViewModelList').and.returnValue(enums);

		component.ngOnInit();

		service.enumValueViewModelList().subscribe(s => {
			expect(component.enumValues).toBe(s);
		});
		flush();
	}));

	it('should call save', () => {
		spyOn(service, 'setEnumValues');
		component.onSave();
		expect(service.setEnumValues).toHaveBeenCalledWith([]);
	});
});
