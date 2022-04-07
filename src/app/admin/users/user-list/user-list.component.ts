import {Component, OnInit} from '@angular/core';
import {UsersService} from '../users.service';
import {Observable} from 'rxjs';
import {UserViewModel} from '../user.viewmodel';

@Component({
	selector: 'dm-user-list',
	templateUrl: './user-list.component.html',
	styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
	users$: Observable<UserViewModel[]>;

	columnDefs = [
		{headerName: 'Username', field: 'username'},
		{headerName: 'Email', field: 'email'},
		{headerName: 'Organisation', field: 'organisationDisplay'},
		{headerName: 'Roles', field: 'roleDisplay'}
	];

	constructor(
		public usersService: UsersService,
	) {}

	ngOnInit() { this.users$ = this.usersService.list(); }
}
