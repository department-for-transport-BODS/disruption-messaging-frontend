import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';

@Component({
	selector: 'dm-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
	constructor(public userService: UsersService) {}

	ngOnInit() {}
}
