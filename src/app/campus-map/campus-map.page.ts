import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IConfig, IMapsResponseObject, ICampus, IMapsResponse } from '../interfaces';
import * as leaflet from 'leaflet';
import { Storage } from '@ionic/storage';
import { SettingsService } from '../settings.service';
import { ConnectionService } from '../connection.service';
import { MapsService } from '../maps.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-campus-map',
  templateUrl: './campus-map.page.html',
  styleUrls: ['./campus-map.page.scss'],
})
export class CampusMapPage implements OnInit {

  config: IConfig;
  geoJSON: IMapsResponseObject[];
  selectedCampus: ICampus;
  layerGroups: {[name: string]: leaflet.LayerGroup} = {};

  @ViewChild('map') mapContainer: ElementRef;
  map: L.Map;

  constructor(
    private storage: Storage,
    private settings: SettingsService,
    private connection: ConnectionService,
    private wsProvider: MapsService,
    private translate: TranslateService
  ) { }

  async ngOnInit() {
    this.config = await this.storage.get('config');
  }

  /**
   * @name ionViewWillEnter
   * @async
   * @description take user to login if there is no session.
   * We are using ionViewDidEnter here because it is run every time the view is
   * entered, other than ionViewDidLoad which will run only once
   */
  ionViewWillEnter() {
    this.connection.checkOnline(true, true);

    // initialize map
    this.map = this.initializeLeafletMap();

    // load geoJson data
    this.loadMapData();

    // after map is initialized use default campus
    this.settings.getSettingValue('campus').then(
      (campus: string) => {
        this.changeCampus(campus);
      }
    );
  }

  /**
   * @name changeCampus
   * @description changes the current campus by name
   * @param campus
   */
  changeCampus(campus: string) {
    this.selectCampus(this.getSelectedCampusObject(campus));
  }

  /**
   * @name loadMapData
   * @description loads campus map data
   */
  async loadMapData() {

    const mapData = await this.wsProvider.getMapData();

    mapData.subscribe(
      (response: IMapsResponse) => {
        this.geoJSON = response;
        this.addFeaturesToLayerGroups(this.geoJSON);
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * @name loadMap
   * @description loads map and initializes it
   */
  initializeLeafletMap() {
    // create map object
    const map = leaflet.map('map').fitWorld();
    leaflet.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'www.uni-potsdam.de',
        maxZoom: 18
      }).addTo(map);
    return map;
  }

  /**
   * @name getSelectedCampusObject
   * @description returns the correct campus object by name
   * @param campusName
   */
  getSelectedCampusObject(campusName: string) {
    return this.config.campusmap.campi.filter(
      (campus: ICampus) => {
        // special logic to map NeuesPalais == Neues Palais and so on
        return campusName === campus.pretty_name.replace(/\s+/g, '');
      }
    )[0];
  }

  /**
   * @name selectCampus
   * @description selects the given campus
   * @param {ICampus} campus
   */
  selectCampus(campus: ICampus) {
    this.selectedCampus = campus;
    if (this.map) {
      this.moveToCampus(this.selectedCampus);
    }
  }

  /**
   * @name moveToCampus
   * @description fits map to given campus
   * @param {ICampus} campus
   */
  moveToCampus(campus: ICampus) {
    this.map.fitBounds(
      campus.lat_long_bounds
    );
  }

  /**
   * @name addFeaturesToLayerGroups
   * @description adds features of geoJSON to layerGroups and adds those layerGroups
   * to the maps object
   */
  addFeaturesToLayerGroups(geoJSON) {
    // just used to remember which categories we've seen already
    const categories: string[] = [];

    for (const obj of geoJSON) {
      // create correct title string beforehand so we don't have to do it twice
      const title = this.translate.instant(
        'page.campus-map.category.' + obj.category
      );

      // check if we already have this category in layerGroups
      if (categories.indexOf(obj.category) === -1) {
        // Create new layer for each unique category
        this.layerGroups[title] = leaflet.layerGroup();
        // just push category name so we know we already got that one
        categories.push(obj.category);
      }

      // add features from each category to corresponding layer
      for (const feature of obj.geo.features) {
        // TODO:
        //  - maybe make this prettier or even include link to OpeningHoursPage
        //  with correct segment?

        const props = feature.properties;

        const popupTemplate = `<h1>${props.Name}</h1><div>${props.description ? props.description : ''}</div>`;

        this.layerGroups[title].addLayer(
          leaflet.geoJSON(feature).bindPopup(
            popupTemplate
          )
        );
      }
    }

    // select all layers by default
    for (const layerName in this.layerGroups) {
      if (layerName) {
        this.layerGroups[layerName].addTo(this.map);
      }
    }

    // now add layerGroups to the map so the user can select/deselect them
    leaflet.control.layers({}, this.layerGroups).addTo(this.map);
  }

}
