import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class IdFormatter {

	public static decodeBase64Id(encodedId: string): string {
		const decoded: string = atob(encodedId);
		return decoded.substring(decoded.indexOf(':') + 1);
	}

	public static encodeDisruptionId(id: number): string {
		return this.encodeBase64Id('DisruptionNode', id.toString());
	}

	public static encodeBase64Id(nodeType: string, id: string): string {
		return btoa(`${nodeType}:${id}`);
	}
}
