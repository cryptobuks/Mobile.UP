import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ImpressumModalPage } from './impressum.modal';
import { TranslateService } from '@ngx-translate/core';
import { IConfig } from '../interfaces';

@Component({
  selector: 'app-impressum',
  templateUrl: './impressum.page.html',
  styleUrls: ['./impressum.page.scss'],
})
export class ImpressumPage implements OnInit {

  config: IConfig;

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.config = await this.storage.get('config');
  }

  async openPage(pageHeader: string) {
    let pageText;
    switch (pageHeader) {
      case 'page.termsOfUse.title': {
        if (this.translate.currentLang === 'de') {
          pageText = this.config.policies.tosTemplateDE;
        } else { pageText = this.config.policies.tosTemplateEN; }
        break;
      }
      case 'page.legalNotice.title': {
        if (this.translate.currentLang === 'de') {
          pageText = this.config.policies.impressumTemplateDE;
        } else { pageText = this.config.policies.impressumTemplateEN; }
        break;
      }
      case 'page.privacyPolicy.title': {
        if (this.translate.currentLang === 'de') {
          pageText = this.config.policies.privacyTemplateDE;
        } else { pageText = this.config.policies.privacyTemplateEN; }
        break;
      }
    }

    const modal = await this.modalCtrl.create({
      component: ImpressumModalPage,
      componentProps: { header: this.translate.instant(pageHeader), text: pageText }
    });
    return await modal.present();
  }

}
