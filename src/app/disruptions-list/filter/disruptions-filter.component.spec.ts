import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisruptionsFilterComponent } from './disruptions-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AgGridModule } from 'ag-grid-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AutocompleteLinesComponent } from './autocomplete-lines/autocomplete-lines.component';

describe('DisruptionsListFilterComponent', () => {
	let component: DisruptionsFilterComponent;
	let fixture: ComponentFixture<DisruptionsFilterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DisruptionsFilterComponent, AutocompleteLinesComponent],
			imports: [
				FormsModule,
				NgSelectModule,
				SharedModule,
				NgxDaterangepickerMd.forRoot(),
				AgGridModule,
				ReactiveFormsModule,
				ApolloTestingModule,
				RouterTestingModule
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionsFilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
