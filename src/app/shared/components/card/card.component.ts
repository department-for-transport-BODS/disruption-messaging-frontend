import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'dm-card',
	styleUrls: ['./card.component.scss'],
	templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}

@Component({
	selector: 'dm-card-header',
	styleUrls: ['./card-header/card-header.component.scss'],
	templateUrl: './card-header/card-header.component.html'
})
export class CardHeaderComponent {
	@Input() actionBtnRoute: string;
	@Input() actionBtnLabel: string;
	@Input() actionBtnId: string;
}
@Component({
	selector: 'dm-card-body',
	styleUrls: ['./card-body/card-body.component.scss'],
	templateUrl: './card-body/card-body.component.html'
})
export class CardBodyComponent {}
@Component({
	selector: 'dm-card-footer',
	styleUrls: ['./card-footer/card-footer.component.scss'],
	templateUrl: './card-footer/card-footer.component.html'
})
export class CardFooterComponent {}
