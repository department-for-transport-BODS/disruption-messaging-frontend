export class MockModalComponent {
	open(id: string) {
		return null;
	}
	close(id: string) {
		return null;
	}
	isVisible() {
		return true;
	}
}

export class MockModalService {
	public get(id: string) {
		return new MockModalComponent();
	}
	public getModal(id: string) {
		return new MockModalComponent();
	}
}
