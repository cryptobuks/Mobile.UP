import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ItemSliding, ToastController } from 'ionic-angular';
import { IConfig, Book } from '../../library/interfaces';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { BookDetailViewPage } from '../book-detail-view/book-detail-view';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ConnectionProvider } from '../../providers/connection/connection';
import { WebHttpUrlEncodingCodec } from '../../library/util';
import { TranslateService } from '@ngx-translate/core';
import { utils } from '../../library/util';

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  query = '';
  config:IConfig;
  startRecord = '1'; // hochsetzen beim nachladen von ergebnissen
  maximumRecords = '15'; // wie viele geladen werden

  isLoading = false;
  isLoaded = false;
  displayedFavorites: Book[] = [];
  allFavorites: Book[] = [];
  bookList = [];
  numberOfRecords = '0';

  /**
   * @constructor
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {Storage} storage
   * @param {Keyboard} keyboard
   * @param {Platform} platform
   * @param {HttpClient} http
   * @param {ConnectionProvider} connection
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private translate: TranslateService,
              private keyboard: Keyboard,
              private platform: Platform,
              private toastCtrl: ToastController,
              private http: HttpClient,
              private connection: ConnectionProvider) {
  }

  /**
   * @name ngOnInit
   * @async
   */
  async ngOnInit() {
    this.connection.checkOnline(true, true);
    this.config = await this.storage.get('config');
  }

  /**
   * @name onScrollListener
   * @description hides keyboard once the user is scrolling
   */
  onScrollListener(): void {
    if (this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))) {
      this.keyboard.hide();
    }
  }

  /**
   * @name searchLibrary
   * @param resetList
   * @param infiniteScroll
   */
  searchLibrary(resetList:boolean, infiniteScroll?) {
    //console.log(this.query);

    let query = this.query.trim();

    if (query.trim() !== '') {

      if (resetList) {
        this.bookList = [];
        this.startRecord = '1';
        this.numberOfRecords = '0';
        this.isLoading = true;
        this.isLoaded = false;
      }

      let url = this.config.webservices.endpoint.library;

      let headers = new HttpHeaders()
        .append('Authorization', this.config.webservices.apiToken);

      let params = new HttpParams({encoder: new WebHttpUrlEncodingCodec()})
        .append('operation', 'searchRetrieve')
        .append('query', query.trim())
        .append('startRecord', this.startRecord)
        .append('maximumRecords', this.maximumRecords)
        .append('recordSchema', 'mods');

      this.http.get(url, {headers:headers, params:params, responseType: 'text'}).subscribe(res => {
        this.parseXMLtoJSON(res).then(data => {

          let tmp, tmpList;
          if (data['zs:searchRetrieveResponse']) {
            tmp = data['zs:searchRetrieveResponse'];
          }

          if (tmp['zs:records']) {
            tmpList = tmp['zs:records']['zs:record'];
          }

          if (tmp["zs:numberOfRecords"]) {
            this.numberOfRecords = tmp['zs:numberOfRecords'];
          }

          let i;
          if (Array.isArray(tmpList)) {
            for (i = 0; i < tmpList.length; i++) {
              this.bookList.push(tmpList[i]['zs:recordData']['mods']);
            }
          }

          // console.log(this.numberOfRecords);
          // console.log(this.bookList);

          this.isLoading = false;
          this.isLoaded = true;
          if (infiniteScroll) { infiniteScroll.complete(); }
        });
      }, error => {
        console.log(error);
        this.isLoading = false;
        this.isLoaded = true;
        if (infiniteScroll) { infiniteScroll.complete(); }
      });
    } else { this.isLoaded = true; }
  }

  /**
   * @name parseXMLtoJSON
   * @param data
   */
  parseXMLtoJSON(data) {
    const parser = new xml2js.Parser({ trim:true, explicitArray:false });

    return new Promise(resolve => {
      parser.parseString(data, function(err, result) {
        resolve(result);
      });
    });
  }

  /**
   * @name resultIndex
   * @returns {string}
   */
  resultIndex(): string {
    if (Number(this.numberOfRecords) < (Number(this.startRecord) + 14)) {
      return this.numberOfRecords;
    } else {
      let s = '1 - ' + (Number(this.startRecord) + 14)
      return s;
    }
  }

  /**
   * @name loadMore
   * @description implements infiniteScrolling
   */
  loadMore(infiniteScroll) {
    this.startRecord = String(Number(this.startRecord) + 15);
    // console.log(this.startRecord);
    // console.log(this.numberOfRecords);
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      this.searchLibrary(false, infiniteScroll);
    } else { infiniteScroll.complete(); }
  }

  /**
   * @name isEnd
   * @description returns true if end of search is reached
   * @returns {boolean}
   */
  isEnd(): boolean {
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      return false;
    } else { return true; }
  }

  /**
   * @name bookDetailView
   * @description triggers view for the detail view of a book
   * @param book
   */
  bookDetailView(book): void {
    this.navCtrl.push(BookDetailViewPage, { book: book });
  }


  /**
   * @name presentToast
   * @param message
   */
  presentToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: "top",
      cssClass: "toastPosition"
    });
    toast.present();
  }

  /**
   * @name makeFavorite
   * @description set favorite and save to storage
   * @param {ADS} ads
   * @param {ItemSliding} slidingItem
   */
  makeFavorite(book: Book, slidingItem:ItemSliding) {

    if (!utils.isInArray(this.displayedFavorites, book)) {
      this.displayedFavorites.push(book);

      if (!utils.isInArray(this.allFavorites, book)) {
        this.allFavorites.push(book);
      }
      this.presentToast(this.translate.instant("page.library.favAdded"));
    } else {
      this.presentToast(this.translate.instant("page.library.favExists"));
    }

    this.storage.set("favoriteBooks", this.allFavorites);

    slidingItem.close();
  }

  /**
   * @name removeFavorite
   * @description removes favorites
   * @param {ADS} ads
   */
  removeFavorite(ads:Book) {
    let i;
    let tmp: Book[] = [];
    for (i = 0; i < this.allFavorites.length; i++) {
      if (this.allFavorites[i] != ads) {
        tmp.push(this.allFavorites[i]);
      }
    }

    let tmp2: Book[] = [];
    for (i = 0; i < this.displayedFavorites.length; i++) {
      if (this.displayedFavorites[i] != ads) {
        tmp2.push(this.displayedFavorites[i]);
      }
    }
    this.allFavorites = [];
    this.allFavorites = tmp;
    this.displayedFavorites = [];
    this.displayedFavorites = tmp2;
    this.presentToast(this.translate.instant("page.practice.favRemoved"));
    this.storage.set("favoriteBooks", this.allFavorites);
  }

  /**
   * @name checkFavorites
   * @async
   * @description checks if favorites are still valid
   */
  async checkFavorites() {
    var tmp:Book[] = await this.storage.get("favoriteBooks");
    /**
     * TODO: check all favorites through SRU of existance and update each record
     */
    /*
    this.allFavorites = [];
    this.displayedFavorites = [];
    if (tmp) {
      var i, j;
      for (i = 0; i < tmp.length; i++) {
        for (j = 0; j < this.defaultList.length; j++) {
          if (tmp[i].uid == this.defaultList[j].uid) {
            if (!utils.isInArray(this.allFavorites, tmp[i])) {
              this.allFavorites.push(tmp[i]);
            }
            break;
          }
        }
      }

      if (tmp.length > this.allFavorites.length) {
        this.presentToast(this.translate.instant("page.practice.favNotAvailable"));
      }
    }

    this.displayedFavorites = this.allFavorites;
    this.storage.set("favoriteJobs", this.allFavorites);
    */
  }

}