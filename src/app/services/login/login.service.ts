import { Injectable } from '@angular/core';
import { ILoginConfigOIDC, IOIDCRefreshResponseObject } from '../../interfaces';
import { ELoginErrors, ISession, IOIDCUserInformationResponse, IOIDCLoginResponse, ICredentials } from '../../interfaces';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpParameterCodec } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /**
   * executes OIDC login
   * @param {ILoginRequest} loginRequest
   * @param {Observer<ISession>} observer
   */
  public oidcLogin(credentials: ICredentials, loginConfig: ILoginConfigOIDC): Observable<ISession> {
    console.log('[oidcLogin] Doing oidcLogin');

    const tokenUrl: string = loginConfig.tokenUrl;

    const headers: HttpHeaders = new HttpHeaders()
      .append('Authorization',    loginConfig.accessToken)
      .append('Content-Type',     loginConfig.contentType);

    // tslint:disable-next-line: no-use-before-declare
    const params: HttpParams = new HttpParams({encoder: new WebHttpUrlEncodingCodec()})
      .append('grant_type',       loginConfig.grantType_password)
      .append('username',         credentials.username)
      .append('password',         credentials.password)
      .append('scope',            loginConfig.scope);


    const rs = new ReplaySubject<ISession>();

    this.http.post(tokenUrl, params, {headers: headers}).subscribe(
      (response: IOIDCLoginResponse) => {
        // create session object with access_token as token, but also attach
        // the whole response in case it's needed
        rs.next({
          credentials:      credentials,
          token:            response.access_token,
          oidcTokenObject:  response,
          timestamp:        new Date()
        });
        rs.complete();
      }, (error) => {
        // Authentication error
        // TODO: Add typing for errors?
        if (error.status = 401) {
          rs.error({reason: ELoginErrors.AUTHENTICATION});
        }
      });

    return rs;
  }


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

/**
 * A `HttpParameterCodec` that uses `encodeURIComponent` and `decodeURIComponent` to
 * serialize and parse URL parameter keys and values.
 *
 * see https://github.com/angular/angular/issues/11058
 */
export class WebHttpUrlEncodingCodec implements HttpParameterCodec {
  encodeKey(k: string): string { return encodeURIComponent(k); }
  encodeValue(v: string): string { return encodeURIComponent(v); }
  decodeKey(k: string): string { return decodeURIComponent(k); }
  decodeValue(v: string) { return decodeURIComponent(v); }
}
