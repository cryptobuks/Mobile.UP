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
    icon?: string;
    customIcon?: string;
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

export interface ICampus {
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

export interface IModul {
  moduleTitle: string;
  examNumber: string;
  shortCut: string;
}

export interface IExam {
  examtitle: string;
  examNumber: string;
  shortCut: string;
  modul: IModul;
}

export interface ISelectedExam {
  pordnr_select: string;
  module: string;
  exam: IExam;
}

export interface ILecturer {
  lecturerId: string;
  lecturerLastname: string;
  lecturerFirstname: string;
  lecturerEmail: string;
  lecturerTitle: string;
}

export interface ILecturers {
  lecturer: ILecturer[] | ILecturer;
}

export interface IEvent {
  eventId: string;
  groupId: string;
  group: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daySC: string;
  day: string;
  rhythmSC: string;
  rhythm: string;
  location: string;
  building: string;
  room: string;
  roomType: string;
  roomSc: string;
  lecturers: ILecturers;
}

export interface IEvents {
  event: IEvent[];
}

export interface ICourse {
  courseId: string;
  courseName: string;
  courseType: string;
  semesterSC: string;
  semester: string;
  enrolmentStatus: string;
  selectedExam: ISelectedExam;
  events: IEvents;
  courseNumber: string;
}

export interface IActualCourses {
  course: ICourse[];
}

export interface IPastCourses {
  course: ICourse[];
}

export interface IStudent {
  lastname: string;
  firstname: string;
  studentNumber: string;
  actualCourses: IActualCourses;
  pastCourses: IPastCourses;
}

export interface IStudentCourses {
  student: IStudent;
}

export interface IPulsAPIResponseGetStudentCourses {
  studentCourses: IStudentCourses;
  message?: string;
}

export interface IPulsApiRequestGetStudentCourses {
  condition: IPulsApiRequestGetStudentCoursesCondition;
  'user-auth': ICredentials;
}

export interface IPulsApiRequestGetStudentCoursesCondition {
  semester: number;
  allLectures: number;
}

/** Credentials used for logging in */
export interface ICredentials {
    username: string;
    password: string;
}

import * as geojson from 'geojson';
export interface IMapsResponseObject {
  campus: string;
  category: string;
  geo: geojson.FeatureCollection;
}

export type IMapsResponse = IMapsResponseObject[];

/**
 * Interface for a contact with telephone number and email address
 */
export interface Contact {
  telephone:  string;
  mail?:      string;
}

/**
* Interface for an address consisting og postal zip code and street
*/
export interface Address {
  postal:     string;
  street:     string;
}

/**
* Interface for a single EmergencyCall entry
* An EmergencyCall always has a 'name:string' and a 'telephone:string', any
* other attribute is optional.
*/
export interface EmergencyCall {
  name:       string;
  contact:    Contact;
  address?:   Address;
  expanded: boolean;
  description?: string;
}

export interface IGradeResponse {
  personalStudyAreas: {
    Abschluss: IGradeDegree;
  };
  message?: string;
}

export interface IGradeDegree {
  AbLtxt: string;
  Abschl: string;
  MtkNr: string;
  Semester: string;
  StgNr: string;
  Studiengaenge: any;
}

/* ~~~ Mensa ~~~ */

export interface IMensaResponse {
  meal: IMeals[];
  campus: string;
  iconHashMap: IMensaIconMap;
}

export interface IMeals {
  order?: number;
  allergens?: IMensaAllergenes[];
  description?: string;
  type?: string[];
  prices?: IMensaPrices;
  date?: string;
  title?: string;
}

export interface IMensaAllergenes {
  description: string;
  descriptionType: string;
  longName: string;
  shortName: string;
  type: string;
}

export interface IMensaPrices {
  guest: number;
  staff: number;
  student: number;
}

export interface IMensaIconMap {
  entry: IMensaIcon[];
}

export interface IMensaIcon {
  key: string;
  value: string;
}

/* ~~~ NewsPage and EventsPage ~~~ */

export interface INewsApiResponse {
  passedArgs: string[];
  vars: INewsVars;
  errors: INewsErrors;
  message: string;
  url: string;
  action: string;
  controller: string;
  model: string;
  base: string;
  webroot: string;
  browser: INewsBrowser;
  here: string;
  hereRel: string;
  routeUrl: string;
}

export interface INewsVars {
  authUser: string;
  flashMessage: string;
  errors: INewsErrors;
  requestUrl: string;
  model: string;
  action: string;
  domain: string;
  webroot: string;
  request: INewsRequest;
  news?: INewsArticle[];
  newsSources?: INewsSources;
  events?: INewsEventsObject[];
  places?: INewsPlaces;
  requestMethod: string;
  browser: INewsBrowser;
  isAjax: boolean;
  loggedIn: boolean;
}

export interface INewsErrors {
  exist: boolean;
  inValidation: string[];
}

export interface INewsBrowser {
  name: string;
}

export interface INewsRequest {
  date: string;
}

export interface INewsArticle {
  News: INewsArticleInfo;
  NewsSource: INewsArticleSource;
}

export interface INewsSources {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
}

export interface INewsArticleInfo {
  id: string;
  headline: string;
  description: string;
  text: string;
  link: string;
  source_id: string;
  time: string;
  DateString: string;
}

export interface INewsArticleSource {
  id: string;
  mapping: string;
  name: string;
  url: string;
  sourceType: string;
  rank: string;
}

export interface INewsEventsObject {
  Event: INewsEventsData;
  Place: INewsEventsPlace;
  Link: string;
}

export interface INewsPlaces {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
}

export interface INewsEventsData {
  id: string;
  eid: string;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  seen: string;
  place_id: string;
  lastChanged: string;
  pic: string;
  pic_square: string;
  pic_big: string;
  ticket_uri: string;
  sourceType: string;
  venue: string;
  DateString: string;
}

export interface INewsEventsPlace {
  id: string;
  name: string;
  mapping: string;
  lat: string;
  lng: string;
  adresse: string;
  plz: string;
  ort: string;
  fb_page_id: string;
  fb_user_id: string;
  fb_search: string;
  icalExportUrl: string;
  feed: string;
}
