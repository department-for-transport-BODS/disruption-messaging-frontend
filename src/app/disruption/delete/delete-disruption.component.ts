import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DeleteDisruptionService } from './delete-disruption.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'dm-delete-disruption',
	templateUrl: './delete-disruption.component.html',
	styleUrls: ['./delete-disruption.component.scss']
})
export class DeleteDisruptionComponent implements OnInit, OnDestroy {
	@Input() id: number;
	@Input() title: string;
	@Input() redirectUrl: string;
	@Output() onCompletion: EventEmitter<any> = new EventEmitter<any>();

	private statusSubscription: Subscription;
	private errorsSubscription: Subscription;

	public status: string;
	public serverErrors: string;

	constructor(
		private deleteDisruptionService: DeleteDisruptionService,
		private ngxSmartModalService: NgxSmartModalService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.statusSubscription = this.deleteDisruptionService.status$.subscribe(val => {
			this.status = val;
		});

		this.errorsSubscription = this.deleteDisruptionService.errors$.subscribe(val => {
			this.serverErrors = val;
		});
	}

	ngOnDestroy() {
		if (this.statusSubscription) {
			this.statusSubscription.unsubscribe();
		}

		if (this.errorsSubscription) {
			this.errorsSubscription.unsubscribe();
		}
	}

	resetState() {
		this.deleteDisruptionService.reset();
	}

	onDeleteButton() {
		this.ngxSmartModalService.get('delete-modal').open();
	}

	onCancel() {
		this.ngxSmartModalService.get('delete-modal').close();
	}

	onOK() {
		this.deleteDisruptionService.delete(this.id);
	}

	onComplete() {
		this.ngxSmartModalService.get('delete-modal').close();
		this.onCompletion.emit();
		// reload disruptions list
		this.router
			.navigateByUrl('/', { skipLocationChange: true })
			.then(() => this.router.navigateByUrl(`/${this.redirectUrl}`));
	}
}
