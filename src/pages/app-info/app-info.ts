import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MapsProvider } from '../../providers/maps/maps';
import { DeviceProvider, IDeviceInfo } from '../../providers/device/device';

@IonicPage()
@Component({
  selector: 'page-app-info',
  templateUrl: 'app-info.html',
})
export class AppInfoPage {

  showSysInfo = false;
  showParticipationInfo = false;
  showLibraryInfo = false;
  showContactPerson = false;

  deviceInfo: IDeviceInfo;

  /**
   * @constructor
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {MapsProvider} mapsProvider
   * @param {DeviceProvider} deviceProvider
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private mapsProvider: MapsProvider,
              private deviceProvider: DeviceProvider) {
  }

  /**
   * @name ngOnInit
   * @description trigger deviceProvider to get information of device
   */
  ngOnInit() {
    this.deviceInfo = this.deviceProvider.getDeviceInfo();
  }

  /**
   * @name callMap
   * @description mapped function to mapsProvider
   * @param {string} location
   */
  callMap(location: string) {
    this.mapsProvider.navigateToAdress(location);
  }
}