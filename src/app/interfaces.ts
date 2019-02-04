export interface IConfig {
    appVersion: string;
    modules: {[moduleName: string]: IModule};
    authorization: ILoginConfig;
    webservices: IWebServices;
    policies: IPolicies;
    general: IGeneral;
    campusmap: ICampusMapConfig;
  }

export interface IModule {
    componentName: string;
    i18nKey?: string;
    icon: string;
    selected?: boolean;
    hide?: boolean;
    url?: string;
    appId?: string;
    urlAndroid?: string;
    urlIOS?: string;
    bundleName?: string;
}

interface ILoginConfig {
    oidc?: ILoginConfigOIDC;
}

export interface ILoginConfigOIDC {
    tokenUrl: string;
    userInformationUrl: string;
    accessToken: string;
    contentType: string;
    grantType_password: string;
    grantType_refresh: string;
    scope: string;
    userInfoParams: IUserInfoParams;
}

export interface IOIDCRefreshResponseObject {
    timestamp: Date;
    oidcTokenObject: IOIDCLoginResponse;
}

/** Server response for OIDC login */
export interface IOIDCLoginResponse {
    access_token: string;
    refresh_token: string;
    scope: string;
    id_token?: string;
    token_type: string;
    expires_in: number;
}

export enum ELoginErrors {
    AUTHENTICATION, TECHNICAL, NETWORK, UNKNOWN_METHOD, UNKNOWN_ERROR
}

interface IUserInfoParams {
    schema: string;
}

interface IWebServices {
    endpoint: IEndpoints;
    apiToken: string;
}

interface IEndpoints {
    personSearch: string;
    mensa: string;
    practiceSearch: string;
    practiceJobPostings: string;
    news: string;
    roomsSearch: string;
    roomplanSearch: string;
    events: string;
    library: string;
    libraryDAIA: string;
    puls: string;
    maps: string;
    openingHours: string;
    emergencyCalls: string;
    logging: string;
    transport: string;
}

interface IPolicies {
    impressumTemplateDE: string;
    impressumTemplateEN: string;
    tosTemplateDE: string;
    tosTemplateEN: string;
    privacyTemplateDE: string;
    privacyTemplateEN: string;
}

interface IGeneral {
    tokenRefreshBoundary: number;
}

interface ICampusMapConfig {
    campi: ICampus[];
}

interface ICampus {
    id: number;
    name: string;
    pretty_name: string;
    coordinates: ICoordinates;
    lat_long_bounds: ILatLongBounds;
}

interface ICoordinates {
    latitude: number;
    longitude: number;
}

type ILatLongBounds = [number, number][];

/** Credentials used for logging in */
export interface ICredentials {
    username: string;
    password: string;
}

/** Interface for the session to be saved in storage */
export interface ISession {
    credentials: ICredentials;
    token: string;
    timestamp?: Date;
    oidcTokenObject?: IOIDCLoginResponse;
}

/** Server response for OIDC user information */
export interface IOIDCUserInformationResponse {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
}

/* ~~~ Settings ~~~ */
export enum ESettingType {
    boolean,
    string,
    number,
    number_radio,
    string_radio,
    checkbox,
    placeholder
  }

export interface ISetting {
    key: string;
    lbl?: string; // identifier of localized resource under page.settings.options.??
    info?: string; // same as lbl but for help text (shown as subtitle)
    value: any;
    icon?: string;
    options?: Array<ISettingOption>;
    type: ESettingType;
}

export interface ISettingOption {
    key: any;
}
