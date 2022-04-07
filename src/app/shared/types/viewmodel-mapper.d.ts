export declare interface ViewModelMapper<T, M> {
	getModel(gqlNode: T): M;
}
