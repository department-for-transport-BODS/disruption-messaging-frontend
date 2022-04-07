import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})

// A base class for all services that talk to the graphql API.
export class QueryService {
	private loadingSubject = new BehaviorSubject<any>(false);
	private errorSubject = new BehaviorSubject<any>(null);
	private serverResponse = new BehaviorSubject<any>(null);

	constructor() {}

	get errors$() {
		return this.errorSubject.asObservable();
	}

	set errors$(val: any) {
		this.errorSubject.next(val);
	}

	get loading$() {
		return this.loadingSubject.asObservable();
	}

	get serverResponse$() {
		return this.serverResponse.asObservable();
	}

	set serverResponse$(val: any) {
		this.serverResponse.next(val);
	}

	protected responseHandler(res) {
		this.loadingSubject.next(res.loading);
		if (res.errors) {
			return this.errorSubject.next(res.errors);
		}
		res.data ? this.serverResponse.next(res.data) : this.serverResponse.next(res);
	}

	protected errorHandler(error: HttpErrorResponse) {
		if (error.error.errors) {
			this.errorSubject.next(error.error.errors.map(e => e.message).join(';'));
		} else {
			this.errorSubject.next(error.status + error.statusText);
		}
	}

	protected resetSubjects() {
		this.serverResponse.next(null);
		this.errorSubject.next(null);
	}
}
