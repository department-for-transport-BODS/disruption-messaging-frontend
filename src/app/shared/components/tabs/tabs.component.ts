import { Component, ContentChildren, QueryList, AfterContentInit, OnInit, Input } from '@angular/core';

import { TabComponent } from '../tab/tab.component';
import { TabsService } from './tabs.service';

@Component({
	selector: 'dm-tabs',
	templateUrl: 'tabs.component.html',
	styleUrls: ['tabs.component.scss']
})
export class TabsComponent implements AfterContentInit, OnInit {
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
	@Input() styleMod: string;
	constructor(private service: TabsService) {}

	ngOnInit() {}

	ngAfterContentInit() {
		this.service.tab$.subscribe(t => {
			const tab = this.tabs && this.tabs.find(f => f.title === t);
			if (tab) {
				this.selectTab(tab);
			}
		});

		const activeTabs = this.tabs.filter(tab => tab.active);

		if (activeTabs.length === 0) {
			this.selectTab(this.tabs.first);
		}
	}

	navigateTo(tab: TabComponent) {
		this.service.setActive(tab.title);
	}

	selectTab(tab: TabComponent) {
		this.tabs.toArray().forEach(t => (t.active = false));
		tab.active = true;
	}

	get tabsClass() {
		if (!this.styleMod) {
			return 'tabs';
		}
		return `tabs tabs--${this.styleMod}`;
	}
}
