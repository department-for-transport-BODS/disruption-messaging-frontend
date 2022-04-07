import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class TabsService {
	public selectedTab = new BehaviorSubject<string>('');
	public tab$ = this.selectedTab.asObservable();

	private allTabs: string[];

	constructor() {}

	init(tabs: string[]) {
		this.allTabs = tabs;
		this.selectedTab.next(this.allTabs[0]);
	}

	get tabs() {
		return this.allTabs;
	}

	setActive(id: string) {
		this.selectedTab.next(id);
	}
}
