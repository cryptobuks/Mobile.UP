import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private storage: Storage, private http: HttpClient) { }

  /**
   * @name getMapData
   * @description returns map data from endpoint in regular intervals
   */
  async getMapData() {
    const config = await this.storage.get('config');
    const headers = new HttpHeaders()
      .set('Authorization', config.webservices.apiToken);

    return this.http.get(
      config.webservices.endpoint.maps,
      { headers: headers }
    );
  }
}
