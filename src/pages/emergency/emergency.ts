import { Component, ChangeDetectorRef } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CacheService } from 'ionic-cache';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmergencyCall } from "../../library/interfaces";
import * as jquery from "jquery";
import { Keyboard } from "@ionic-native/keyboard/ngx";
import { ConnectionProvider } from "../../providers/connection/connection";
import { IConfig } from '../../library/interfaces';
import { MapsProvider } from "../../providers/maps/maps";
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { CallNumber } from '@ionic-native/call-number/ngx';

/**
 * @class EmergencyPage
 * @classdesc class for a page that shows EmergencyCall entries. The list of items can
 * be filtered by using a searchbox.
 */
@IonicPage()
@Component({
  selector: 'page-emergency',
  templateUrl: 'emergency.html'
})
export class EmergencyPage {

  jsonPath: string = "../../assets/json/emergency";
  displayedList: Array < EmergencyCall > ;
  defaultList: Array < EmergencyCall > ;
  isLoaded;
  cordova = false;

  /**
   * @constructor
   * @description Constructor of EmergencyPage
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {Keyboard} keyboard
   * @param {ChangeDetectorRef} chRef
   * @param {Platform} platform
   * @param {Storage} storage
   * @param {CacheService} cache
   * @param {HttpClient} http
   * @param {WebIntentProvider} webIntent
   * @param {LaunchNavigator} launchNavigator
   * @param {ConnectionProvider} connection
   * @param {Contacts} contacts
   * @param {CallNumber} callNumber
   */
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    private chRef: ChangeDetectorRef,
    private platform: Platform,
    private storage: Storage,
    private cache: CacheService,
    private http: HttpClient,
    private mapProvider: MapsProvider,
    private connection: ConnectionProvider,
    private contacts: Contacts,
    private callNumber: CallNumber) {
      if (this.platform.is("cordova")) {
        this.cordova = true
      }
  };

  ngOnInit() {
    this.connection.checkOnline(true, true);
    this.loadEmergencyCalls();
  }

  /**
   * @name  initializeList
   * @description initializes the list that is to be displayed with default values
   */
  public initializeList(): void {
    this.displayedList = this.defaultList;
  }

  /**
   * @name loadEmergencyCalls
   * @description loads default items from json file
   */
  async loadEmergencyCalls(refresher?) {

    let config:IConfig = await this.storage.get("config");

    let headers: HttpHeaders = new HttpHeaders()
      .append("Authorization", config.webservices.apiToken);

    var url = config.webservices.endpoint.emergencyCalls;
    let request = this.http.get(url, {headers:headers});

    if (refresher) {
      this.cache.removeItem("emergencyCalls");
    } else {
      this.isLoaded = false;
    }

    this.cache.loadFromObservable("emergencyCalls", request).subscribe((response) => {

      if (refresher) {
        refresher.complete();
      }

      this.defaultList = response;
      this.isLoaded = true;
      this.initializeList();
    });
    // on error //this.defaultList = require("../../assets/json/emergency");

  }


  // hides keyboard once the user is scrolling
  onScrollListener() {
    if (this.platform.is("cordova") && (this.platform.is("ios") || this.platform.is("android"))) {
      this.keyboard.hide();
    }
  }

  /**
   * @name contains
   * @description checks, whether y is a substring of x
   * @param {string} x - String that does or does not contain string y
   * @param {string} y - String that is or is not contained in string y
   * @returns {Boolean} - Whether string x contains string y
   */
  private contains(x: string, y: string): boolean {
    return x.toLowerCase().includes(y.toLowerCase());
  }

  /**
   * @name filterItems
   * @description when a query is typed into the searchbar this method is called. It
   * filters the complete list of items with the query and modifies the
   * displayed list accordingly.
   * @param {string} query - a query string the items will be filtered with
   */
  public filterItems(query: string): void {
    this.initializeList();

    if (query) {
      this.displayedList = jquery.grep(
        this.defaultList,
        (emergencyCall, index) => {
          return this.contains(emergencyCall.name, query);
        }
      );
      this.chRef.detectChanges();
    }
  }

  /**
   * @name expand
   * @description toggles the expand value of one item to be expanded in the view
   * @param {EmergencyCall} emergencyCall
   */
  expand(emergencyCall: EmergencyCall) {
    for (let i = 0; i < this.displayedList.length; i++) {
      let currentCall = this.displayedList[i];
      if (currentCall.name == emergencyCall.name) {
        currentCall.expanded = !currentCall.expanded;
      }
    }
  }

  /**
   * @name callMap
   * @description opens the map
   * @param {EmergencyCall} emergencyCall
   */
  callMap(emergencyCall: EmergencyCall) {
    let location = emergencyCall.address.street;
    if (emergencyCall.address.postal){
      location += ' ' + emergencyCall.address.postal;
    }

    this.mapProvider.navigateToAdress(location);
  }


    /**
   * @name exportContact
   * @description exports a contact to the local phone book
   * @param {EmergencyCall} emergencyCall
   */
  exportContact(emergencyCall: EmergencyCall) {
    if (this.platform.is("cordova")) {
      let contact: Contact = this.contacts.create();

      contact.name = new ContactName(null, emergencyCall.name);

      if (emergencyCall.contact.telephone) { contact.phoneNumbers = [new ContactField('work', emergencyCall.contact.telephone)]; }
      if (emergencyCall.contact.mail)   { contact.emails = [new ContactField('work', emergencyCall.contact.mail)]; }

      contact.save().then(
        () => console.log('Contact saved!', contact),
        (error: any) => console.error('Error saving contact.', error)
      );
    }
  }

  /**
   * @name callContact
   * @description using native call for calling numbers
   * @param {string} number
   * https://www.javascripttuts.com/making-phone-calls-to-contacts-with-ionic-in-one-go/
   */
  callContact(number: string) {
    this.callNumber.callNumber(number, true)
      .then(() => console.log('Dialer Launched!'))
      .catch(() => console.log('Error launching dialer'));
  }

}