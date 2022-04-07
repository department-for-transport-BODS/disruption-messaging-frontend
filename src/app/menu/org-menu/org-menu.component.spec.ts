import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgMenuComponent } from './org-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HttpClientModule } from '@angular/common/http';
import { UserStoreService } from 'src/app/user/user.store.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrgMenuComponent', () => {
	let component: OrgMenuComponent;
	let fixture: ComponentFixture<OrgMenuComponent>;
	let userStore: UserStoreService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AngularSvgIconModule, ApolloTestingModule, HttpClientModule, RouterTestingModule, HttpClientModule],
			declarations: [OrgMenuComponent],
			providers: [UserStoreService]
		}).compileComponents();
	}));

	beforeEach(() => {
		userStore = TestBed.get(UserStoreService);

		fixture = TestBed.createComponent(OrgMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
