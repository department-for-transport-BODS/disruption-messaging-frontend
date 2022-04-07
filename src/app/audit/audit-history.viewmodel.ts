export interface AuditHistoryChanges {
	field: string;
	oldValue: string;
	newValue: string;
	action: string;
}

export interface AuditHistoryViewModel {
	username: string;
	timestampFromNow: string;
	timestamp: string;
	action: string;
	contentType: string;
	fieldChanges: AuditHistoryChanges[];
	link?: string;
	objectRepr: string;
	objectId: number;
}
