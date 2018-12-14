import { Directive, HostListener } from '@angular/core';
import { IOIDCUserInformationResponse } from "../../providers/login-provider/interfaces";
import { PopoverComponent } from "./popover";
import { PopoverController } from "ionic-angular";
import { Storage } from "@ionic/storage";

@Directive({
  selector: '[popoverButton]'
})
export class PopoverButton{

  constructor(private storage: Storage,
              private popoverCtrl: PopoverController) {}

  @HostListener('click', ['$event']) onClick(event) {
    this.storage.get('userInformation').then(
      (userInformation:IOIDCUserInformationResponse) => {
        let popover = this.popoverCtrl.create(
          PopoverComponent,
          {userInformation:userInformation}
        );
        popover.present({
          ev: event
        });
      }
    )
  }
}