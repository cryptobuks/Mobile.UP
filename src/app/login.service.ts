import { Injectable } from '@angular/core';
import { ILoginConfigOIDC, IOIDCRefreshResponseObject, IOIDCUserInformationResponse, IOIDCLoginResponse } from './interfaces';
import { ELoginErrors, ISession } from './interfaces';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /**
   * refreshes OIDC token with refreshToken and the loginConfig. Returns an object
   * containing new OIDC-Response-Object and a timestamp.
   * @param refreshToken
   * @param loginConfig
   */
  public oidcRefreshToken(refreshToken: string, loginConfig: ILoginConfigOIDC): Observable<IOIDCRefreshResponseObject> {
    console.log('[oidcLogin] Doing oidc token refresh');

    const tokenUrl: string = loginConfig.tokenUrl;

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', loginConfig.accessToken)
      .append('Content-Type', loginConfig.contentType);

    const params: HttpParams = new HttpParams()
      .append('grant_type', loginConfig.grantType_refresh)
      .append('refresh_token', refreshToken);

    const rs = new ReplaySubject<IOIDCRefreshResponseObject>();

    this.http.post(tokenUrl, params, {headers: headers}).subscribe((response: IOIDCLoginResponse) => {
      // create session object with access_token as token, but also attach
      // the whole response in case it's needed
      rs.next({oidcTokenObject: response, timestamp: new Date()});
      rs.complete();
    }, error => {
      console.log(error);
      // Authentication error
      if (error.status = 401) {
        rs.error({reason: ELoginErrors.AUTHENTICATION});
      }
    });

    return rs;
  }

  oidcGetUserInformation(session: ISession, loginConfig: ILoginConfigOIDC): Observable<IOIDCUserInformationResponse> {
    const userInfoURL: string = loginConfig.userInformationUrl;

    // const headers = {
    //   'Authorization': `${session.oidcTokenObject.token_type} ${session.oidcTokenObject.access_token}`
    // };

    // const params = {
    //   'schema': loginConfig.userInfoParams.schema
    // };

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization', `${session.oidcTokenObject.token_type} ${session.oidcTokenObject.access_token}`);

    const params: HttpParams = new HttpParams()
      .append('schema', loginConfig.userInfoParams.schema);

    const rs = new ReplaySubject<IOIDCUserInformationResponse>();

    this.http.get(userInfoURL, {params: params, headers: headers}).subscribe((response: IOIDCUserInformationResponse) => {
      rs.next(response);
      rs.complete();
    }, error => {
      console.log(error);
      if (error.status === 401) {
        rs.error({reason: ELoginErrors.AUTHENTICATION});
      }
    });

    return rs;
  }
}
