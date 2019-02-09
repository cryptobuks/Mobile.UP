import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { IConfig } from '../../library/interfaces';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { BookDetailViewPage } from '../book-detail-view/book-detail-view';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ConnectionProvider } from "../../providers/connection/connection";
import { WebHttpUrlEncodingCodec } from '../../library/util';

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  query = "";
  config:IConfig;
  startRecord = "1"; // hochsetzen beim nachladen von ergebnissen
  maximumRecords = "15"; // wie viele geladen werden

  isLoading = false;
  isLoaded = false;
  bookList = [];
  numberOfRecords = "0";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private keyboard: Keyboard,
              private platform: Platform,
              private http: HttpClient,
              private connection: ConnectionProvider) {
  }

  async ngOnInit() {
    this.connection.checkOnline(true, true);
    this.config = await this.storage.get("config");
  }

  // hides keyboard once the user is scrolling
  onScrollListener() {
    if (this.platform.is("cordova") && (this.platform.is("ios") || this.platform.is("android"))) {
      this.keyboard.hide();
    }
  }

  searchLibrary(resetList:boolean, infiniteScroll?) {
    console.log(this.query);

    let query = this.query.trim();

    if (query.trim() != "") {

      if (resetList) {
        this.bookList = [];
        this.startRecord = "1";
        this.numberOfRecords = "0";
        this.isLoading = true;
        this.isLoaded = false;
      }

      let url = this.config.webservices.endpoint.library;

      let headers = new HttpHeaders()
        .append("Authorization", this.config.webservices.apiToken);

      let params = new HttpParams({encoder: new WebHttpUrlEncodingCodec()})
        .append("operation", "searchRetrieve")
        .append("query", query.trim())
        .append("startRecord", this.startRecord)
        .append("maximumRecords", this.maximumRecords)
        .append("recordSchema", "mods");

      this.http.get(url, {headers:headers, params:params, responseType: "text"}).subscribe(res => {
        this.parseXMLtoJSON(res).then(data => {

          var tmp, tmpList;
          if (data["zs:searchRetrieveResponse"]) {
            tmp = data["zs:searchRetrieveResponse"];
          }

          if (tmp["zs:records"]) {
            tmpList = tmp["zs:records"]["zs:record"];
          }

          if (tmp["zs:numberOfRecords"]) {
            this.numberOfRecords = tmp["zs:numberOfRecords"];
          }

          var i;
          if (Array.isArray(tmpList)) {
            for (i = 0; i < tmpList.length; i++) {
              this.bookList.push(tmpList[i]["zs:recordData"]["mods"]);
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

  parseXMLtoJSON(data) {
    var parser = new xml2js.Parser({ trim:true, explicitArray:false });

    return new Promise(resolve => {
      parser.parseString(data, function(err, result) {
        resolve(result);
      });
    })
  }

  resultIndex() {
    if (Number(this.numberOfRecords) < (Number(this.startRecord) + 14)) {
      return this.numberOfRecords;
    } else {
      let s = "1 - " + (Number(this.startRecord) + 14)
      return s;
    }
  }

  loadMore(infiniteScroll) {
    this.startRecord = String(Number(this.startRecord) + 15);
    // console.log(this.startRecord);
    // console.log(this.numberOfRecords);
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      this.searchLibrary(false, infiniteScroll);
    } else { infiniteScroll.complete(); }
  }

  isEnd() {
    if (Number(this.startRecord) <= Number(this.numberOfRecords)) {
      return false;
    } else { return true; }
  }

  bookDetailView(book) {
    this.navCtrl.push(BookDetailViewPage, { book: book });
  }

}
