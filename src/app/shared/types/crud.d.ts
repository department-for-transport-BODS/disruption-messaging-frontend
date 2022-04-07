import { Observable } from 'rxjs';

export declare interface Crud<C, U, M> {
	list(): Observable<M[]>;

	create(input: C): void;

	update(id: number, input: U): void;

	delete(entryId: number | string): void;
}

export declare interface List<M> {
	list(): Observable<M[]>;
}

export declare interface Create<I> {
	create(input: I): void;
}

export declare interface Update<I> {
	update(input: I): void;
}

export declare interface Delete<M> {
	delete(model: M): void;
}
