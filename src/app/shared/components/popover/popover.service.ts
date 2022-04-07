import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class PopoverService {
	private popovers$ = [];

	constructor() {}

	get popovers() {
		return this.popovers$;
	}

	open(id: string) {
		this.popovers.push(id);
	}

	close(id: string) {
		const idx = this.popovers.findIndex(f => f === id);
		this.popovers.splice(idx, 1);
	}

	closeAll() {
		this.popovers$ = [];
	}
}
