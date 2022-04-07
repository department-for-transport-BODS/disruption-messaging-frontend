import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserViewModel } from '../user.viewmodel';
import { UsersService } from '../users.service';

@Component({
	selector: 'dm-user-delete',
	templateUrl: './user-delete.component.html',
	styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit, OnDestroy {
	subscription: Subscription;
	user: UserViewModel;
	success = false;

	constructor(public usersService: UsersService, private modalService: NgxSmartModalService) {}

	ngOnInit() {
		this.subscription = this.usersService.deleteUser$.subscribe(user => {
			this.user = user;
			this.modalService.getModal('userDeleteModal').open();
		});
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	confirmDelete() {
		this.usersService.delete(this.user.id);
		this.user = null;
	}
}
