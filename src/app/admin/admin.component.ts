import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { TabsService } from '../shared/components/tabs/tabs.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FeaturesService } from '../shared/services/features/features.service';

@Component({
	selector: 'dm-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterContentInit, OnDestroy {
	private tabSubscription: Subscription;
	currentTab = 'Users';
	tabs = ['Users', 'Organisations', 'Social'];
	mailingListEnabled = false;

	constructor(
		private tabsService: TabsService,
		private activatedRoute: ActivatedRoute,
		private featureService: FeaturesService) {}

	ngOnInit() {
		this.featureService.getFeature('Mailing List').subscribe(res => {
			if (res.data.feature.enabled && !this.mailingListEnabled) {
				this.tabs.push('Mailing List');
				this.mailingListEnabled = true;
			}
			this.tabsService.init(this.tabs);
			const tab = this.activatedRoute.snapshot.queryParams.tab as string;

			if (tab) {
				const tabs = this.tabsService.tabs;
				const index = tabs.findIndex(f => f.toLowerCase() === tab.toLowerCase());
				this.tabsService.setActive(tabs[index]);
			}
		});

	}

	ngAfterContentInit(): void {
		this.tabSubscription = this.tabsService.tab$.subscribe(t => (this.currentTab = t));
	}

	ngOnDestroy(): void {
		this.tabSubscription.unsubscribe();
	}
}
