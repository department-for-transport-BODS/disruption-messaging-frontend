import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateFormatter } from 'src/app/shared/formatters/date.formatter';
import { IDisruptionAuditNode, IContentTypeType, IChangedFields } from 'src/generated/graphql';
import { AuditHistoryChanges, AuditHistoryViewModel } from './audit-history.viewmodel';
import { ILogActionEntry } from 'src/generated/enum-overrides';

export enum ContentType {
	Disruption = 'Disruption'
}

@Injectable({
	providedIn: 'root'
})
export class AuditHistoryMapper {
	toViewModel(gqlNode: IDisruptionAuditNode): AuditHistoryViewModel {
		return {
			contentType: gqlNode.contentType.name,
			action: ILogActionEntry[gqlNode.action],
			fieldChanges: this.processChanges(gqlNode.changedFields),
			username: gqlNode.actor ? gqlNode.actor.username : 'System',
			timestamp: DateFormatter.shortDateAndTime(gqlNode.timestamp),
			timestampFromNow: moment(gqlNode.timestamp).fromNow(),
			link: this.generateLink(gqlNode.contentType, gqlNode.objectPk),
			objectRepr: gqlNode.objectRepr,
			objectId: gqlNode.objectId
		};
	}

	private processChanges(changes: IChangedFields[]): AuditHistoryChanges[] {
		if (!changes) {
			return null;
		}
		return changes.map(cf => {
			let oldValue = [];
			let newValue = [];
			try {
				oldValue = JSON.parse(cf.oldValue);
				newValue = JSON.parse(cf.newValue);
			} catch (e) {
				console.log('Error in JSON parsing: ', e);
			}
			let difference: string[];
			if (Array.isArray(oldValue) || Array.isArray(newValue)) {
				if (newValue.length > oldValue.length) {
					difference = [...newValue].filter(x => !oldValue.includes(x));
					return {
						field: this.formatField(cf.field),
						newValue: difference.join(', '),
						action: 'Added'
					} as AuditHistoryChanges;
				} else if (oldValue.length > newValue.length) {
					difference = [...oldValue].filter(x => !newValue.includes(x));
					return {
						field: this.formatField(cf.field),
						newValue: difference.join(', '),
						action: 'Deleted'
					} as AuditHistoryChanges;
				}
				return {
					field: this.formatField(cf.field),
					action: 'Changed',
					oldValue: this.formatField(oldValue.join(', ')),
					newValue: this.formatField(newValue.join(', '))
				} as AuditHistoryChanges;
			}
			return {
				field: this.formatField(cf.field),
				action: 'Changed',
				oldValue: this.formatField(oldValue),
				newValue: this.formatField(newValue)
			} as AuditHistoryChanges;
		});
	}

	private generateLink(contentType: IContentTypeType, objectPk: string): string {
		if (contentType && contentType.name === ContentType.Disruption) {
			return `/disruption/${objectPk}`;
		}
		return '';
	}

	private sentanceCase(str: string) {
		return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
	}

	private formatField(field: string) {
		if (field) {
			return field.replace(/_/g, ' ');
		} else {
			return 'None';
		}
	}
}
