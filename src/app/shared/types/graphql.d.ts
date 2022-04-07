import { ExecutionResult } from 'graphql';

interface MutationResponseType<T> {
	errors: string;
	success: boolean;
	data?: T;
}

export interface GenericGraphQLType<T> {
	[key: string]: MutationResponseType<T>;
}
export interface MutationResponse<T> extends ExecutionResult {
	data?: GenericGraphQLType<T>;
}
