import { Injectable, Injector } from '@angular/core';
import { IUserGQL, IUserType } from 'src/generated/graphql';
import { UserStoreService } from './user/user.store.service';
import { HttpClient } from '@angular/common/http';
import { of, Observable, ObservableInput } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ConfigService } from './config.service';
import { Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { DefaultOptions } from 'apollo-client';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthenticationService } from './authentication/authentication.service';
import { has } from 'lodash';
import { Router } from '@angular/router';

const apolloOptions = {
	watchQuery: {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
	},
	query: {
		fetchPolicy: 'cache-first',
		errorPolicy: 'all',
	},
	mutate: {
		errorPolicy: 'all',
		context: { useMultipart: true },
	}
};


@Injectable()
export class AppInitService {
	constructor(
		private userGQL: IUserGQL,
		private userService: UserStoreService,
		private http: HttpClient,
		private httpLink: HttpLink,
		private config: ConfigService,
		private apollo: Apollo,
		private injector: Injector) {}

	Init() {
		return new Promise<boolean>((resolve: (a: boolean) => void): void => {
			this.http.get('./config.json')
				.pipe(
					map((c: ConfigService) => {
						this.config.setUrl(c.apiUrl);
						resolve(true);
					}),
					catchError((x: { status: number }, caught: Observable<void>): ObservableInput<{}> => {
						if (x.status !== 404) {
							resolve(false);
						}
						this.config.setUrl(environment.apiUrl);
						resolve(true);
						return of({});
					})
				).subscribe();
		}).then(() => {
			const checkAuthLink = new ApolloLink((operation, forward) => {
				return forward(operation).map((response) => {
					if (has(response, 'errors')) {
						console.warn(response.errors[0].message);
						response.data = null;
						if (response.errors[0].message === 'Access denied for unauthenticated user') {
							this.userService.logout();
							const router = this.injector.get(Router);
							router.navigate(['/login']);
						}
					}
					return response;
				});
			});
			const link = checkAuthLink.concat(this.httpLink.create({
				uri: this.config.apiUrl,
				withCredentials: true
			}));
			this.apollo.create({
				cache: new InMemoryCache(),
				link,
				defaultOptions: apolloOptions as DefaultOptions,
				resolvers: {}
			});
		}).then(() => {
			return new Promise<boolean>((resolve: () => void, reject: () => void): void => {
				this.userGQL
					.watch()
					.valueChanges
					.pipe(filter(result => result.data != null))
					.pipe(map(result => result.data.user as IUserType))
					.subscribe(
						user => {
							if (user && user.id) {
								this.userService.setAuthenticated(user);
							}
							resolve();
						},
						error => {
							// TODO log error
							console.log(error);
							reject();
						}
					);
			});
		});
	}
}
