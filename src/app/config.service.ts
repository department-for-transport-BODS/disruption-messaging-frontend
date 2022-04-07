import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	apiUrl: string;

	constructor() {}

	setUrl(url) {
		this.apiUrl = url;
	}
}
