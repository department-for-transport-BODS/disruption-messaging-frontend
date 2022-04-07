import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { UsersModule } from './users/users.module';
import { OrganisationModule } from './organisation/organisation.module';
import { SharedModule } from '../shared/shared.module';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocialModule } from '../social/social.module';
import { SocialComponent } from './social/social.component';
import { TabsService } from '../shared/components/tabs/tabs.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { MailingListModule } from './mailing-list/mailing-list.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeaturesService } from '../shared/services/features/features.service';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('AdminComponent', () => {
	let component: AdminComponent;
	let tabService: TabsService;
	let featuresService: FeaturesService;
	let fixture: ComponentFixture<AdminComponent>;
	let featureObs;
	let featuresSpy;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdminComponent, SocialComponent],
			imports: [
				UsersModule,
				OrganisationModule,
				SharedModule,
				ApolloTestingModule,
				RouterTestingModule,
				SocialModule,
				NgxSmartModalModule,
				MailingListModule,
				HttpClientTestingModule
			],
			providers: [
				TabsService,
				FeaturesService,
				{ provide: ActivatedRoute, useValue: { snapshot: { queryParams: { tab: 'social' } } } }
			]
		}).compileComponents();
	}));
	describe('AdminComponent generic tests', () => {
		const feature = {
			data: { feature: {enabled: true}}
		};

		beforeEach(() => {
			tabService = TestBed.get(TabsService);
			featuresService = TestBed.get(FeaturesService);
			fixture = TestBed.createComponent(AdminComponent);

			featureObs = cold('--a|', {a: feature})
			featuresSpy = spyOn(featuresService, 'getFeature').and.returnValue(featureObs);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component).toBeTruthy();
		});

		it('should render four tabs', async(() => {
			component.ngOnInit();
			getTestScheduler().flush();
			fixture.detectChanges();

			const tabs = fixture.nativeElement.querySelectorAll('dm-tab');
			expect(tabs.length).toBe(4);
		}));

		it('should set tab when route param provided', async(() => {
			spyOnProperty(tabService, 'tabs').and.returnValue(['Users', 'Organisations', 'Social', 'Mailing List']);
			spyOn(tabService, 'setActive').and.callThrough();

			component.ngOnInit();
			getTestScheduler().flush();
			fixture.detectChanges();

			expect(tabService.setActive).toHaveBeenCalledWith('Social');
		}));

		it('should initialise tabs service', async(() => {
			spyOn(tabService, 'init').and.callThrough();

			component.ngOnInit();
			getTestScheduler().flush();
			fixture.detectChanges();

			expect(tabService.init).toHaveBeenCalledWith(['Users', 'Organisations', 'Social', 'Mailing List']);
		}));
	});

	describe('AdminComponent feature flag test', () => {
		const feature = {
			data: { feature: {enabled: false}}
		};
		beforeEach(() => {
			tabService = TestBed.get(TabsService);
			featuresService = TestBed.get(FeaturesService);
			fixture = TestBed.createComponent(AdminComponent);

			featureObs = cold('--a|', {a: feature})
			featuresSpy = spyOn(featuresService, 'getFeature').and.returnValue(featureObs);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should not render tab if mailing list feature is disabled', async(() => {
			const disabled = {
				data: { feature: {enabled: false}}
			};
			featureObs = cold('--a|', {a: disabled});
			featuresSpy.and.getSpy().and.returnValue(featureObs);
			spyOn(tabService, 'init').and.callThrough();

			component.ngOnInit();
			getTestScheduler().flush();
			fixture.detectChanges();

			expect(tabService.init).toHaveBeenCalledWith(['Users', 'Organisations', 'Social']);
		}));
	});
});
