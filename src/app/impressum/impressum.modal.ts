import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal-page',
  templateUrl: './impressum.modal.html',
})
export class ImpressumModalPage {

  @Input() text;
  @Input() header;

  constructor() {
  }

}
