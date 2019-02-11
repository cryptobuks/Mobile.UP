import { Component, OnInit } from '@angular/core';
import { IConfig } from '../interfaces';
import { ConnectionService } from '../services/connection/connection.service';
import { Storage } from '@ionic/storage';
import * as xml2js from 'xml2js';
import { Platform, ModalController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { WebHttpUrlEncodingCodec } from '../services/login/login.service';
import { BookDetailModalPage } from '../components/book-list/book-detail.modal';

@Component({
  selector: 'app-library-search',
  templateUrl: './library-search.page.html',
  styleUrls: ['./library-search.page.scss'],
})
export class LibrarySearchPage implements OnInit {

  query;
  config: IConfig;
  startRecord = '1'; // hochsetzen beim nachladen von ergebnissen
  maximumRecords = '15'; // wie viele geladen werden

  isLoading = false;
  isLoaded = false;
  bookList = [];
  numberOfRecords = '0';

  constructor(
    private connection: ConnectionService,
    private storage: Storage,
    private platform: Platform,
    private keyboard: Keyboard,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.connection.checkOnline(true, true);
    this.config = await this.storage.get('config');
  }

  // hides keyboard once the user is scrolling
  onScrollListener() {
    if (this.platform.is('cordova') && (this.platform.is('ios') || this.platform.is('android'))) {
      this.keyboard.hide();
    }
  }

  searchLibrary(resetList: boolean, event?, infiniteScroll?) {
    console.log(event);

    if (event) {
      this.query = event.detail.value;
    }

    const query = this.query.trim();

    if (query.trim() !== '') {

      if (resetList) {
        this.bookList = [];
        this.startRecord = '1';
        this.numberOfRecords = '0';
        this.isLoading = true;
        this.isLoaded = false;
      }

      const url = this.config.webservices.endpoint.library;

      const headers = new HttpHeaders()
        .append('Authorization', this.config.webservices.apiToken);

      const params = new HttpParams({encoder: new WebHttpUrlEncodingCodec()})
        .append('operation', 'searchRetrieve')
        .append('query', query.trim())
        .append('startRecord', this.startRecord)
        .append('maximumRecords', this.maximumRecords)
        .append('recordSchema', 'mods');

      this.http.get(url, {headers: headers, params: params, responseType: 'text'}).subscribe(res => {
        this.parseXMLtoJSON(res).then(data => {

          let tmp, tmpList;
          if (data['zs:searchRetrieveResponse']) {
            tmp = data['zs:searchRetrieveResponse'];
          }

          if (tmp['zs:records']) {
            tmpList = tmp['zs:records']['zs:record'];
          }

          if (tmp['zs:numberOfRecords']) {
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
          if (infiniteScroll) { infiniteScroll.target.complete(); }
        });
      }, error => {
        console.log(error);
        this.isLoading = false;
        this.isLoaded = true;
        if (infiniteScroll) { infiniteScroll.target.complete(); }
      });
    } else { this.isLoaded = true; }
  }

  parseXMLtoJSON(data) {
    const parser = new xml2js.Parser({ trim: true, explicitArray: false });

    return new Promise(resolve => {
      parser.parseString(data, function(err, result) {
        resolve(result);
      });
    });
  }

  resultIndex() {
    if (Number(this.numberOfRecords) < (Number(this.startRecord) + 14)) {
      return this.numberOfRecords;
    } else {
      const s = '1 - ' + (Number(this.startRecord) + 14);
      return s;
    }
  }

  loadMore(infiniteScroll) {
    this.startRecord = String(Number(this.startRecord) + 15);
    // console.log(this.startRecord);
    // console.log(this.numberOfRecords);
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      this.searchLibrary(false, undefined, infiniteScroll);
    } else { infiniteScroll.target.complete(); }
  }

  isEnd() {
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      return false;
    } else { return true; }
  }

  async bookDetailView(book) {
    const modal = await this.modalCtrl.create({
      component: BookDetailModalPage,
      componentProps: { book: book }
    });
    modal.present();
  }

}
