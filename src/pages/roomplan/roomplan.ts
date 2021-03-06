import { Component } from '@angular/core';
import {
  IonicPage,
  NavParams,
  ToastController,
  Events
} from 'ionic-angular';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from "@angular/common/http";
import {
  WebHttpUrlEncodingCodec
} from "../../providers/login-provider/lib";
import {
  IConfig,
  IHouse, IHousePlan,
  IReservationRequestResponse,
  IRoom,
  IRoomApiRequest, IRoomEvent
} from "../../library/interfaces";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { CacheService } from 'ionic-cache';
import {ConnectionProvider} from "../../providers/connection/connection";
import {AlertProvider} from "../../providers/alert/alert";


@IonicPage()
@Component({
  selector: 'page-roomplan',
  templateUrl: 'roomplan.html',
})
export class RoomplanPage {

  //params
  default_house:IHouse;
  default_room:IRoom;

  //bindings
  select_day:string;
  refresher: any;
  days: any;

  //vars
  houseMap: Map<string, IHousePlan> = new Map<string, IHousePlan>();
  housesFound: Array<IHouse> = [];
  day_offset:string;
  response: any;
  current_location: string;
  passedLocation:string;
  error: HttpErrorResponse;
  requestProcessed:boolean = false;

  constructor(
    private storage: Storage,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public translate: TranslateService,
    private cache: CacheService,
    public http: HttpClient,
    private swipeEvent: Events,
    private connection: ConnectionProvider,
    private alertProvider: AlertProvider) {
    this.default_house = navParams.get("house");
    this.default_room = navParams.get("room");
    this.passedLocation = navParams.get("campus");
  }

  ionViewDidLoad() {
    this.connection.checkOnline(true, true);

    this.day_offset = "0";

    this.days = [];
    for(let i = 0; i < 7; i++){
      let day:Date = new Date();
      day.setDate(day.getDate() + i);
      this.days.push({"lbl": day, "value": i.toString()})
    }
    this.select_day = this.day_offset;
  }

  /**
   * Convert campus number to short string (for localization)
   * @param num - Campus number (1-3)
   * @returns {string} - campus short string (gs,np,go), defaults to gs
   */
  getLocationByNum(num) { // one could use numbers everywhere, but this is better for readability
    switch (num) {
      case "1": {
        return "NeuesPalais"
      }
      case "2": {
        return "Golm"
      }
      case "3": {
        return "Griebnitzsee"
      }
      default: {
        return "Griebnitzsee"
      }
    }
  }

  /**
   * Changes the day for which to load data
   * Day comes from DOM select element "select_day"
   */
  changeDay() {
    this.housesFound = [];
    this.houseMap = new Map<string, IHousePlan>();
    this.day_offset = this.select_day;
    //reset defaults so they don't open on new day
    this.default_room = null;
    this.default_house = null;
    this.getRoomInfo();
  }

  /**
   * Called by refresher element to refresh info
   * @param refresher - DOM refresher element, passed for later closing
   * @returns {Promise<void>}
   */
  async refreshRoom(refresher) {
    this.getRoomInfo();
    this.refresher = refresher
  }

  /**
   * Switch campus location and reload info for new campus
   * @param location - number as string representing campus
   */
  switchLocation($event) {
    this.houseMap = new Map<string, IHousePlan>();
    this.housesFound = [];
    var location;
    if ($event == "Griebnitzsee") {
      location = "3";
    } else if ($event == "NeuesPalais") {
      location = "1";
    } else { location = "2"; }
    this.current_location = location;
    this.getRoomInfo()
  }

  /**
   * Expand house expandable to show rooms
   * Closes rooms when house is closed
   * @param house - lbl of house to close
   */
  public expandHouse(house) {
    for (let i = 0; i < this.housesFound.length; i++) {
      if (this.housesFound[i].lbl == house) {
        this.housesFound[i].expanded = !this.housesFound[i].expanded;
      }
      if(this.housesFound[i].expanded == false){
        this.housesFound[i].rooms.forEach(function (room) {
          room.expanded = false;
        })
      }
    }
  }

  /**
   * Expand room expandable to show events
   * @param house - lbl of house to close
   * @param room - lbl of room to close
   */
  public expandRoom(house, room) {
    for (let i = 0; i < this.housesFound.length; i++) {
      if (this.housesFound[i].lbl == house) {
        for (let h = 0; h < this.housesFound[i].rooms.length; h++) {
          if (this.housesFound[i].rooms[h].lbl == room) {
            this.housesFound[i].rooms[h].expanded = !this.housesFound[i].rooms[h].expanded;
          }
        }
      }
    }
  }

  /**
   * Adds a room to a house (specified by its lbl)
   * If the house does not exist one is created
   * Room is only added if house does not already have that room (identified by lbl)
   * @param houseLbl - lbl of house to add room for
   * @param {IRoom} room - room to add to house
   */
  addRoomToHouse(houseLbl, room: IRoom) {
    let house: IHousePlan;
    if (this.houseMap.has(houseLbl)) {
      house = this.houseMap.get(houseLbl);
    } else {
      house = {
        lbl: houseLbl,
        rooms: new Map<string, IRoom>(),
        expanded: false
      };
    }

    if (house.rooms.has(room.lbl) == false) {
      house.rooms.set(room.lbl, room);
      this.houseMap.set(houseLbl, house);
    }
  }

  /**
   * Main function to query api and build array that is later parsed to DOM
   * Gets all its parameters from pages global vars (location, day, default house/room)
   * @returns {Promise<void>}
   */
  async getRoomInfo() {
    this.requestProcessed = false;
    let location = this.current_location;
    let config: IConfig = await this.storage.get("config");

    let roomRequest: IRoomApiRequest = {
      authToken: config.authorization.credentials.accessToken,
    };

    let headers: HttpHeaders = new HttpHeaders().append("Authorization", roomRequest.authToken);

    let start = new Date();
    let end = new Date();
    start.setHours(8);
    end.setHours(22);
    start.setDate(start.getDate() + +this.day_offset); // unary plus for string->num conversion
    end.setDate(end.getDate() + +this.day_offset);

    let params: HttpParams = new HttpParams({encoder: new WebHttpUrlEncodingCodec()})
      .append("format", "json")
      .append("startTime", start.toISOString())
      .append("endTime", end.toISOString())
      .append("campus", location);

    if (this.refresher != null) {
      this.cache.removeItem("roomplanInfo"+location+start.toString()+end.toString());
    }

    let request = this.http.get(config.webservices.endpoint.roomplanSearch, {headers: headers, params: params});
    this.cache.loadFromObservable("roomplanInfo"+location+start.toString()+end.toString(), request).subscribe(
      (response: IReservationRequestResponse) => {

        this.houseMap = new Map<string, IHousePlan>();
        this.housesFound = [];
        this.error = null;

        if(response.reservationsResponse.return.length == 0 || !response.reservationsResponse.return){
          // list will remain empty
        } else {
          for (let reservation of response.reservationsResponse.return) {
            // API often returns basically empty reservations, we want to ignore these
            if (reservation.veranstaltung != "" && reservation.veranstaltung != null) {

              if ((reservation.roomList.room instanceof Array) == false) {
                reservation.roomList.room = [reservation.roomList.room]
              }

              let roomList = <Array<string>> reservation.roomList.room;
              for (let i = 0; i < roomList.length; i++) {
                let split = roomList[i].split(".");
                let room: IRoom = {
                  lbl: split.splice(2, 5).join('.'),
                  events: [],
                  expanded: false
                };

                this.addRoomToHouse(split[1], room);

                let persons:Array<String> = [];
                let personArray = reservation.personList.person;
                for(let h = 0; h < personArray.length; h = h + 2){
                  if(personArray[h] == "N.N" ){
                    persons.push("N.N ")
                  }
                  if(personArray[h] != "" && personArray[h + 1] != ""){
                    persons.push(personArray[h + 1].trim() + " " + personArray[h].trim())
                  }
                }

                persons = persons.filter(this.uniqueFilter);

                let event: IRoomEvent = {
                  lbl: reservation.veranstaltung,
                  startTime: new Date(reservation.startTime),
                  endTime: new Date(reservation.endTime),
                  persons: persons
                };

                this.houseMap.get(split[1]).rooms.get(room.lbl).events.push(event)
              }
            }
          }

          // load defaults if they are passed to the page by other files
          let default_error = "";
          if(this.default_house != null){
            if(this.houseMap.has(this.default_house.lbl)){
              this.houseMap.get(this.default_house.lbl).expanded = true;

              if(this.default_room != null){
                if(this.houseMap.get(this.default_house.lbl).rooms.has(this.default_room.lbl)){
                  this.houseMap.get(this.default_house.lbl).rooms.get(this.default_room.lbl).expanded = true;
                }else{
                  default_error = "page.roomplan.no_room";
                }
              }
            }else{
              default_error = "page.roomplan.no_house";
            }
          }

          if (default_error != ""){
            this.translate.get(default_error).subscribe(
              value => {
                const toast = this.toastCtrl.create({
                  message: value,
                  duration: 6000,
                  position: 'middle',
                });
                toast.present();
              }
            )
          }

          //sadly templates cannot parse maps,
          //therefore we will generate a new data structure based on arrays and parse everything into there
          let tmpHouseList = Array.from(this.houseMap.values());
          for (let i = 0; i < tmpHouseList.length; i++) {
            let tmpRoomArray = Array.from(tmpHouseList[i].rooms.values());

            tmpRoomArray.sort(RoomplanPage.compareRooms);
            for(let h = 0; h < tmpRoomArray.length; h++){
              tmpRoomArray[h].events.sort(RoomplanPage.compareEvents);
            }

            let tmpHouse: IHouse = {
              lbl: tmpHouseList[i].lbl,
              rooms: tmpRoomArray,
              expanded: tmpHouseList[i].expanded
            };
            this.housesFound.push(tmpHouse);
          }
          this.housesFound.sort(RoomplanPage.compareHouses);

          //if refresher is running complete it
          if (this.refresher != null) {
            this.refresher.complete()
          }
          this.requestProcessed = true;
        }
      },
      (error: HttpErrorResponse) => {
        //if error reset vars and set error variable for display
        this.requestProcessed = true;
        this.error = error;
        this.houseMap = new Map<string, IHousePlan>();
        this.housesFound = [];
        if (this.refresher != null) {
          this.refresher.complete()
        }

        this.alertProvider.showAlert({
          alertTitleI18nKey: "alert.title.error",
          messageI18nKey: `alert.httpErrorStatus.${error.status}`
        })
      }
    );
  }

  /**
   * Comparator for event sorting
   * @param {IRoomEvent} a
   * @param {IRoomEvent} b
   * @returns {number}
   */
  static compareEvents(a:IRoomEvent, b:IRoomEvent) {
    if (a.startTime < b.startTime)
      return -1;
    if (a.startTime > b.startTime)
      return 1;
    return 0;
  }

  /**
   * Comparator for room sorting
   * @param {IRoomEvent} a
   * @param {IRoomEvent} b
   * @returns {number}
   */
  static compareRooms(a:IRoom, b:IRoom) {
    if (a.lbl < b.lbl)
      return -1;
    if (a.lbl > b.lbl)
      return 1;
    return 0;
  }

  /**
   * Comparator for house
   * @param {IRoomEvent} a
   * @param {IRoomEvent} b
   * @returns {number}
   */
  static compareHouses(a:IHouse, b:IHouse) {
    if (a.lbl < b.lbl)
      return -1;
    if (a.lbl > b.lbl)
      return 1;
    return 0;
  }

  /**
   * Filter for person array uniqueness
   * @param value
   * @param index
   * @param self
   * @returns {boolean}
   */
  uniqueFilter(value, index, self) {
    return self.indexOf(value) === index;
  }

  swipeCampus(event) {
    if (Math.abs(event.deltaY) < 50) {
      if (event.deltaX > 0) {
        // user swiped from left to right
        this.swipeEvent.publish('campus-swipe-to-right', this.getLocationByNum(this.current_location));
      } else if (event.deltaX < 0) {
        // user swiped from right to left
        this.swipeEvent.publish('campus-swipe-to-left', this.getLocationByNum(this.current_location));
      }
    }
  }
}
