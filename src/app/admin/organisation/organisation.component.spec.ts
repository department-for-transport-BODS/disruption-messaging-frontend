import { TestBed, fakeAsync, flush, ComponentFixture } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { IOrganisationListGQL } from '../../../generated/graphql';
import { OrganisationMapper } from './organisation.mapper';
import { NgxSmartModalModule, NgxSmartModalService } from 'ngx-smart-modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrganisationComponent } from './organisation.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { OrganisationService } from './organisation.service';

describe('OrganisationComponent', () => {
	let component: OrganisationComponent;
	let fixture: ComponentFixture<OrganisationComponent>;
	let modalService: NgxSmartModalService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ApolloTestingModule, SharedModule, NgxSmartModalModule.forRoot(), RouterTestingModule],
			declarations: [OrganisationComponent],
			providers: [IOrganisationListGQL, OrganisationMapper, NgxSmartModalService, OrganisationService],
			schemas: [NO_ERRORS_SCHEMA]
		});
		modalService = TestBed.get(NgxSmartModalService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OrganisationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('creates the component', () => {
		expect(component).toBeTruthy();
	});

	it('open add modal', fakeAsync(() => {
		const modal = modalService.getModal('orgModal');
		const dmBtn = fixture.nativeElement.querySelector('dm-button').querySelector('button');
		expect(modal.isVisible()).toBeFalsy();
		dmBtn.click();
		flush();
		expect(modal.isVisible()).toBeTruthy();
	}));

	it('open edit modal', fakeAsync(() => {
		const modal = modalService.getModal('orgModal');
		const dmBtn = fixture.nativeElement.querySelector('dm-button').querySelector('button');
		dmBtn.click();
		flush();
		expect(modal.isVisible()).toBeTruthy();
	}));
});
