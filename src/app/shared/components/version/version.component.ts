import {Component, OnDestroy, OnInit} from '@angular/core';
import { VERSION } from 'src/environments/version';
import { IAppVersionGQL } from '../../../../generated/graphql';
import { Subscription } from 'rxjs';

@Component({
	selector: 'dm-version',
	templateUrl: './version.component.html',
	styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit, OnDestroy {

	frontendVersion: string;
	backendVersion: string;
	dataSubscription: Subscription;

	constructor(private versionGQL: IAppVersionGQL) {
		this.frontendVersion = VERSION.hash;
	}

	ngOnInit() {
		this.dataSubscription = this.versionGQL.fetch().subscribe((res) => this.backendVersion = res.data.version as string);
	}

	ngOnDestroy(): void {
		this.dataSubscription.unsubscribe();
	}
}
