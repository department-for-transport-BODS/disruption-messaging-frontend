import { FormGroup } from '@angular/forms';

export declare interface GraphQLMapper<I> {
	getMutationInput(form: FormGroup): I;
}
