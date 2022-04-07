import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisruptionsGridComponent } from './disruptions-grid.component';
import { DisruptionsListModule } from '../disruptions-list.module';
import { DisruptionsListService } from '../disruptions-list.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';

describe('DisruptionsListComponent', () => {
	let component: DisruptionsGridComponent;
	let fixture: ComponentFixture<DisruptionsGridComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DisruptionsListModule, ApolloTestingModule, NgxSmartModalModule.forRoot()],
			providers: [DisruptionsListService]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisruptionsGridComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
