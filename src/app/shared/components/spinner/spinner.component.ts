import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'dm-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit, OnChanges {

  @Input() name: string;
  @Input() show: boolean = false;
  @Input() size: string = 'medium';

  constructor(private spinnerService: NgxSpinnerService) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.show.currentValue === true) {
      this.spinnerService.show(this.name)
    } else {
      this.spinnerService.hide(this.name)
    }
  }

}
