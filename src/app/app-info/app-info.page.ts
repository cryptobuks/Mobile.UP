import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { IConfig } from '../interfaces';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { NavigatorService } from '../services/navigator/navigator.service';

@Component({
  selector: 'app-app-info',
  templateUrl: './app-info.page.html',
  styleUrls: ['./app-info.page.scss'],
})
export class AppInfoPage implements OnInit {

  showSysInfo = false;
  showParticipationInfo = false;
  showLibraryInfo = false;
  showContactPerson = false;

  deviceInfo = {
    'cordovaVersion': undefined,
    'appVersion': undefined,
    'osPlatform': undefined,
    'osVersion': undefined,
    'uuid': undefined,
    'deviceManufacturer': undefined,
    'deviceModel': undefined
  };

  constructor(
    private device: Device,
    private storage: Storage,
    private mapsProvider: NavigatorService,
    private platform: Platform
  ) { }

  ngOnInit() {
    if (this.platform.is('cordova')) {
      this.getDeviceInfo();
    }
  }

  getDeviceInfo() {
    this.deviceInfo = {
      'cordovaVersion': this.device.cordova,
      'appVersion': undefined,
      'osPlatform': this.device.platform,
      'osVersion': this.device.version,
      'uuid': this.device.uuid,
      'deviceManufacturer': this.device.manufacturer,
      'deviceModel': this.device.model
    };

    this.storage.get('config').then((config: IConfig) => {
      this.deviceInfo.appVersion = config.appVersion;
    });
  }

  callMap(location: string) {
    this.mapsProvider.navigateToAdress(location);
  }

}
