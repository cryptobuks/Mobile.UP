import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IFeedback } from '../../library/interfaces';
import { DeviceProvider, IDeviceInfo } from '../../providers/device/device';
import { ConnectionProvider } from '../../providers/connection/connection';
import { ConfigProvider } from '../../providers/config/config';
import { SessionProvider } from '../../providers/session/session';


@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  private form : FormGroup;
  loggedIn: boolean = false;
  deviceInfo: IDeviceInfo;
  feedback: IFeedback = {};
  session;

  /**
   * @constructor
   * @param {HttpClient} http
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {ConnectionProvider} connection
   * @param {SessionProvider} sessionProvider
   * @param {DeviceProvider} deviceProvider
   * @param {FormBuilder} formBuilder
   */
  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private connection: ConnectionProvider,
    private sessionProvider: SessionProvider,
    private deviceProvider: DeviceProvider,
    private formBuilder: FormBuilder) {
      this.form = this.formBuilder.group({
        rating: ['', Validators.required], //, Validators.required
        description: [''],
        recommend: ['', Validators.required],
        anonymous: ['true', Validators.required],
      });

  }

  /**
   * @async
   * @name ionViewWillEnter
   */
  async ionViewWillEnter() {
    this.connection.checkOnline(true, true);
    let tmp = await this.sessionProvider.getSession();
    var session = undefined;
    if (tmp) {
      if (typeof tmp !== 'object') {
        session = JSON.parse(tmp);
      } else { session = tmp; }
    }

    if (session) {
      this.session = session;
      this.loggedIn=true;
    }
  }

  ngOnInit() {
    this.deviceInfo = this.deviceProvider.getDeviceInfo();
  }

  /**
   * @async
   * @name submitForm
   * @description submitForm
   */
  async submitForm(){
    if (this.deviceInfo){
      this.feedback = {
        cordovaVersion: this.deviceInfo.cordovaVersion,
        appVersion: this.deviceInfo.appVersion,
        osPlatform: this.deviceInfo.osPlatform,
        osVersion: this.deviceInfo.osVersion,
        uuid: this.deviceInfo.uuid,
        deviceManufacturer: this.deviceInfo.deviceManufacturer,
        deviceModel: this.deviceInfo.deviceModel
      };
    }

    this.feedback['rating'] = this.form.value.rating;
    this.feedback['description'] = this.form.value.description;
    this.feedback['recommend'] = this.form.value.recommend;

    if(this.loggedIn && this.form.value.anonymous) {
      this.feedback['uid'] = this.session.credentials.username;
    }
    //console.log(feedback);
  }

  /**
   * @name
   */
  postFeedback() {

    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ConfigProvider.config.webservices.apiToken
    });

    let request:IFeedback = this.feedback;

    this.http.post<IFeedback>(
      ConfigProvider.config.webservices.endpoint.feedback,
      request,
      {headers: headers}
    ).subscribe(
      (response) => {
        //TODO: Show Toast
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}