'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Mobile.UP</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppInfoPageModule.html" data-type="entity-link">AppInfoPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' : 'data-target="#xs-components-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' :
                                            'id="xs-components-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                            <li class="link">
                                                <a href="components/AppInfoPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppInfoPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BookDetailViewPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookDetailViewPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CampusMapPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CampusMapPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailedOpeningPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailedOpeningPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetailedPracticePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetailedPracticePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EmergencyPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmergencyPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventModal.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventModal</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GradesPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GradesPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImpressumPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImpressumPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LecturesPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LecturesPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LegalNoticePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LegalNoticePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LibraryPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LibraryPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogoutPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MensaPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MensaPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MobileUPApp.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MobileUPApp</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OpeningHoursPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OpeningHoursPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PersonsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PersonsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PracticePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PracticePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyPolicyPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PrivacyPolicyPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoomplanPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoomplanPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoomsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoomsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SettingsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SettingsPage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsOfUsePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TermsOfUsePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimetablePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimetablePage</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TransportPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TransportPage</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' : 'data-target="#xs-directives-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' :
                                        'id="xs-directives-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                        <li class="link">
                                            <a href="directives/PopoverButton.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">PopoverButton</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' : 'data-target="#xs-injectables-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' :
                                        'id="xs-injectables-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                        <li class="link">
                                            <a href="injectables/AlertProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AlertProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConfigProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConnectionProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConnectionProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ErrorLoggingProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ErrorLoggingProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MapsProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MapsProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PulsProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PulsProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SessionProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SessionProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SettingsProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SettingsProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UPLoginProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UPLoginProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WebIntentProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebIntentProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WebServiceProvider.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>WebServiceProvider</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' : 'data-target="#xs-pipes-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' :
                                            'id="xs-pipes-links-module-AppModule-56bb45d2e91e89594c79a3d662c53ca4"' }>
                                            <li class="link">
                                                <a href="pipes/MomentPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MomentPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BookDetailViewPageModule.html" data-type="entity-link">BookDetailViewPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CampusMapPageModule.html" data-type="entity-link">CampusMapPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ComponentsModule.html" data-type="entity-link">ComponentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ComponentsModule-b73c3a8a82d15cbe64cf921c4d965339"' : 'data-target="#xs-components-links-module-ComponentsModule-b73c3a8a82d15cbe64cf921c4d965339"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ComponentsModule-b73c3a8a82d15cbe64cf921c4d965339"' :
                                            'id="xs-components-links-module-ComponentsModule-b73c3a8a82d15cbe64cf921c4d965339"' }>
                                            <li class="link">
                                                <a href="components/BookListViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BookListViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CampusTabComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CampusTabComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContentDrawerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContentDrawerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EventViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EventViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExpandableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExpandableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterDisclaimerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterDisclaimerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GradesTableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GradesTableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HintComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HintComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LectureListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LectureListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MensaMealComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MensaMealComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewsArticleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewsArticleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PopoverComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PopoverComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TabBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TabBarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DetailedOpeningPageModule.html" data-type="entity-link">DetailedOpeningPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DetailedPracticePageModule.html" data-type="entity-link">DetailedPracticePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmergencyPageModule.html" data-type="entity-link">EmergencyPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EventsPageModule.html" data-type="entity-link">EventsPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GradesPageModule.html" data-type="entity-link">GradesPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link">HomePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ImpressumPageModule.html" data-type="entity-link">ImpressumPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LecturesPageModule.html" data-type="entity-link">LecturesPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LegalNoticePageModule.html" data-type="entity-link">LegalNoticePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LibraryPageModule.html" data-type="entity-link">LibraryPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link">LoginPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LogoutPageModule.html" data-type="entity-link">LogoutPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MensaPageModule.html" data-type="entity-link">MensaPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NewsPageModule.html" data-type="entity-link">NewsPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OpeningHoursPageModule.html" data-type="entity-link">OpeningHoursPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PersonsPageModule.html" data-type="entity-link">PersonsPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PracticePageModule.html" data-type="entity-link">PracticePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PrivacyPolicyPageModule.html" data-type="entity-link">PrivacyPolicyPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RoomplanPageModule.html" data-type="entity-link">RoomplanPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RoomsPageModule.html" data-type="entity-link">RoomsPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SettingsPageModule.html" data-type="entity-link">SettingsPageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TermsOfUsePageModule.html" data-type="entity-link">TermsOfUsePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TimetablePageModule.html" data-type="entity-link">TimetablePageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransportPageModule.html" data-type="entity-link">TransportPageModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/WebHttpUrlEncodingCodec.html" data-type="entity-link">WebHttpUrlEncodingCodec</a>
                            </li>
                            <li class="link">
                                <a href="classes/WebHttpUrlEncodingCodec-1.html" data-type="entity-link">WebHttpUrlEncodingCodec</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/MobileUPErrorHandler.html" data-type="entity-link">MobileUPErrorHandler</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ADS.html" data-type="entity-link">ADS</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact.html" data-type="entity-link">Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EmergencyCall.html" data-type="entity-link">EmergencyCall</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAction.html" data-type="entity-link">IAction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IActualCourses.html" data-type="entity-link">IActualCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IADSResponse.html" data-type="entity-link">IADSResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAlertOptions.html" data-type="entity-link">IAlertOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAppUrls.html" data-type="entity-link">IAppUrls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICampus.html" data-type="entity-link">ICampus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICampusMapConfig.html" data-type="entity-link">ICampusMapConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConfig.html" data-type="entity-link">IConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICoordinates.html" data-type="entity-link">ICoordinates</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICourse.html" data-type="entity-link">ICourse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICredentials.html" data-type="entity-link">ICredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICredentialsLoginResponse.html" data-type="entity-link">ICredentialsLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDeparture.html" data-type="entity-link">IDeparture</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEndpoints.html" data-type="entity-link">IEndpoints</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IErrorLogging.html" data-type="entity-link">IErrorLogging</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEvent.html" data-type="entity-link">IEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventObject.html" data-type="entity-link">IEventObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventRules.html" data-type="entity-link">IEventRules</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEvents.html" data-type="entity-link">IEvents</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IExam.html" data-type="entity-link">IExam</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGeneral.html" data-type="entity-link">IGeneral</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGradeDegree.html" data-type="entity-link">IGradeDegree</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHouse.html" data-type="entity-link">IHouse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHousePlan.html" data-type="entity-link">IHousePlan</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJourneyDetailRef.html" data-type="entity-link">IJourneyDetailRef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IJourneyResponse.html" data-type="entity-link">IJourneyResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILecturer.html" data-type="entity-link">ILecturer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILecturers.html" data-type="entity-link">ILecturers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginConfig.html" data-type="entity-link">ILoginConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginConfig_Credentials.html" data-type="entity-link">ILoginConfig_Credentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginConfig_OIDC.html" data-type="entity-link">ILoginConfig_OIDC</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginConfig_SSO.html" data-type="entity-link">ILoginConfig_SSO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginProvider.html" data-type="entity-link">ILoginProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoginRequest.html" data-type="entity-link">ILoginRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMapsResponseObject.html" data-type="entity-link">IMapsResponseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMeals.html" data-type="entity-link">IMeals</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMensaAllergenes.html" data-type="entity-link">IMensaAllergenes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMensaIcon.html" data-type="entity-link">IMensaIcon</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMensaIconMap.html" data-type="entity-link">IMensaIconMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMensaPrices.html" data-type="entity-link">IMensaPrices</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMensaResponse.html" data-type="entity-link">IMensaResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IModul.html" data-type="entity-link">IModul</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IModule.html" data-type="entity-link">IModule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsApiResponse.html" data-type="entity-link">INewsApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsArticle.html" data-type="entity-link">INewsArticle</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsArticleInfo.html" data-type="entity-link">INewsArticleInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsArticleSource.html" data-type="entity-link">INewsArticleSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsBrowser.html" data-type="entity-link">INewsBrowser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsErrors.html" data-type="entity-link">INewsErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsEventsData.html" data-type="entity-link">INewsEventsData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsEventsObject.html" data-type="entity-link">INewsEventsObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsEventsPlace.html" data-type="entity-link">INewsEventsPlace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsPlaces.html" data-type="entity-link">INewsPlaces</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsRequest.html" data-type="entity-link">INewsRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsSources.html" data-type="entity-link">INewsSources</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/INewsVars.html" data-type="entity-link">INewsVars</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOIDCLoginResponse.html" data-type="entity-link">IOIDCLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOIDCRefreshResponseObject.html" data-type="entity-link">IOIDCRefreshResponseObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOIDCUserInformationResponse.html" data-type="entity-link">IOIDCUserInformationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPastCourses.html" data-type="entity-link">IPastCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPerson.html" data-type="entity-link">IPerson</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPluginUrlParams.html" data-type="entity-link">IPluginUrlParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPolicies.html" data-type="entity-link">IPolicies</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProduct.html" data-type="entity-link">IProduct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getAcademicAchievements.html" data-type="entity-link">IPulsApiRequest_getAcademicAchievements</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getAcademicAchievements_condition.html" data-type="entity-link">IPulsApiRequest_getAcademicAchievements_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getCourseData.html" data-type="entity-link">IPulsApiRequest_getCourseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getCourseData_condition.html" data-type="entity-link">IPulsApiRequest_getCourseData_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleCourses.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleCourses_condition.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleCourses_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleRoot.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleRoot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleRoot_condition.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleRoot_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleSubTree.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleSubTree</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getLectureScheduleSubTree_condition.html" data-type="entity-link">IPulsApiRequest_getLectureScheduleSubTree_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getPersonalStudyAreas.html" data-type="entity-link">IPulsApiRequest_getPersonalStudyAreas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getStudentCourses.html" data-type="entity-link">IPulsApiRequest_getStudentCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsApiRequest_getStudentCourses_condition.html" data-type="entity-link">IPulsApiRequest_getStudentCourses_condition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getAcademicAchievements.html" data-type="entity-link">IPulsAPIResponse_getAcademicAchievements</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getCourseData.html" data-type="entity-link">IPulsAPIResponse_getCourseData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getLectureScheduleCourses.html" data-type="entity-link">IPulsAPIResponse_getLectureScheduleCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getLectureScheduleRoot.html" data-type="entity-link">IPulsAPIResponse_getLectureScheduleRoot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getLectureScheduleSubTree.html" data-type="entity-link">IPulsAPIResponse_getLectureScheduleSubTree</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getPersonalStudyAreas.html" data-type="entity-link">IPulsAPIResponse_getPersonalStudyAreas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPulsAPIResponse_getStudentCourses.html" data-type="entity-link">IPulsAPIResponse_getStudentCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IReservationRequestResponse.html" data-type="entity-link">IReservationRequestResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IReservationRequestResponseDetail.html" data-type="entity-link">IReservationRequestResponseDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IReservationRequestResponsePersonList.html" data-type="entity-link">IReservationRequestResponsePersonList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IReservationRequestResponseReturn.html" data-type="entity-link">IReservationRequestResponseReturn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IReservationRequestResponseRoomList.html" data-type="entity-link">IReservationRequestResponseRoomList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRoom.html" data-type="entity-link">IRoom</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRoomApiRequest.html" data-type="entity-link">IRoomApiRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRoomEvent.html" data-type="entity-link">IRoomEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRoomRequestResponse.html" data-type="entity-link">IRoomRequestResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRoomRequestResponseReturn.html" data-type="entity-link">IRoomRequestResponseReturn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISelectedExam.html" data-type="entity-link">ISelectedExam</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISession.html" data-type="entity-link">ISession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISetting.html" data-type="entity-link">ISetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISettingOption.html" data-type="entity-link">ISettingOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISSOUrls.html" data-type="entity-link">ISSOUrls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStudent.html" data-type="entity-link">IStudent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStudentCourses.html" data-type="entity-link">IStudentCourses</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IStudieCourse.html" data-type="entity-link">IStudieCourse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserInfoParams.html" data-type="entity-link">IUserInfoParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IWebServices.html" data-type="entity-link">IWebServices</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});