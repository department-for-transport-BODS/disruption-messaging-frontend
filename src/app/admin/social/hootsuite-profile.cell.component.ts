import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IHootSuiteProfileType } from 'src/generated/graphql';

@Component({
	selector: 'clickable-cell',
	template: `
		<div *ngIf="isHootSuite else notHootSuite">
			<ul *ngIf="hootSuiteProfiles.length else noProfiles" style="list-style-type:none; padding:0;">
				<li *ngFor="let profile of hootSuiteProfiles">
					<a
						*ngIf="profile.profileType === 'A_1' else other"
						href="https://twitter.com/i/user/{{profile.socialId}}"
						target="_blank"
					>
						<span>Twitter/{{profile.socialId}}</span>
					</a>
					<ng-template #other>
						<span style="white-space:nowrap">Facebook/{{profile.socialUsername}}</span>
					</ng-template>
				</li>
			</ul>
			<ng-template #noProfiles>
				<span>No profiles attached</span>
			</ng-template>
		</div>
		<ng-template #notHootSuite>
			<span>-</span>
		</ng-template>
	`,
	styles: []
})
export class HootSuiteCellRenderer implements ICellRendererAngularComp {
	public params: any = false;
	public hootSuiteProfiles: IHootSuiteProfileType[] = [];
	public isHootSuite = false;

	agInit(params: any): void {
		this.params = params;
		this.hootSuiteProfiles = params.data && params.data.hootSuiteProfiles;
		this.isHootSuite = params.data && params.data.isHootSuite;
	}

	refresh(): boolean {
		return false;
	}
}
