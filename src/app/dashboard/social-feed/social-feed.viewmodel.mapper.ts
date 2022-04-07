import { Injectable } from '@angular/core';
import { SocialMessageViewModel } from 'src/app/shared/disruption-mapper/social-message.viewmodel';
import moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class SocialFeedViewModelMapper {
	toViewModel(graphql: any): SocialMessageViewModel {
		const vm = new SocialMessageViewModel(graphql);
		vm.publishedOn = moment(vm.publishedOn, 'DD/MM/YYYY HH:mm:ss').fromNow();
		return vm;
	}
}
