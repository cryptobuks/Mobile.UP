import { Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * @type {IAlertOptions}
 */
export interface IAlertOptions {
  alertTitleI18nKey: string;
  messageI18nKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  currentAlert = null;

  /**
   * @constructor
   * @param {AlertController} alertCtrl
   * @param {TranslateService} translate
   * @param {NavController} navCtrl
   */
  constructor(
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private navCtrl: NavController
    ) { }

  /**
   * @name showAlert
   * @description shows alert as specified by alertOptions parameter
   * @param {IAlertOptions} alertOptions
   */
    showAlert(alertOptions: IAlertOptions) {
      // only show new alert if no other alert is currently open
      if (!this.currentAlert) {
        this.currentAlert = this.alertCtrl.create({
          header: this.translate.instant(alertOptions.alertTitleI18nKey),
          message: this.translate.instant(alertOptions.messageI18nKey),
          buttons: [
            {
              text: this.translate.instant('button.toHome'),
              handler: () => { this.navCtrl.navigateRoot('/home'); }
            },
            {
              text: this.translate.instant('button.continue')
            }
          ]
        });

        this.currentAlert.onDidDismiss(() => this.currentAlert = null);
        this.currentAlert.present();
      }
    }
}
