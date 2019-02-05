import { Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LaunchNavigatorOptions, AppSelectionOptions, RememberChoiceOptions, PromptsOptions } from '@ionic-native/launch-navigator';
// tslint:disable-next-line:max-line-length
import { LaunchNavigator } from 'plugins/uk.co.workingedge.phonegap.plugin.launchnavigator/uk.co.workingedge.phonegap.plugin.launchnavigator';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService implements OnInit {

  private promptsOptions: PromptsOptions = {
    'headerText': 'Auswahl merken?',
    'bodyText': 'Beim nächsten Mal die gleiche App verwenden?',
    'yesButtonText': 'Ja',
    'noButtonText': 'Nein'
  };

  private rememberChoiceOptions: RememberChoiceOptions = {
    'prompt': this.promptsOptions
  };

  private appSelectionOptions: AppSelectionOptions = {
    'dialogHeaderText': 'App zur Navigation auswählen...',
    'cancelButtonText': 'Abbrechen',
    'rememberChoice': this.rememberChoiceOptions
  };

  private options: LaunchNavigatorOptions = {
    'appSelection': this.appSelectionOptions
  };

  constructor(private translate: TranslateService, private launchNavigator: LaunchNavigator) { }

  ngOnInit() {
    this.promptsOptions = {
      'headerText': this.translate.instant('launchNavigator.headerText'),
      'bodyText': this.translate.instant('launchNavigator.bodyText'),
      'yesButtonText': this.translate.instant('button.yes'),
      'noButtonText': this.translate.instant('button.no')
    };

    this.appSelectionOptions = {
      'dialogHeaderText': this.translate.instant('launchNavigator.dialogHeaderText'),
      'cancelButtonText': this.translate.instant('button.cancel')
    };
  }

  public navigateToAdress(location: string) {
    this.launchNavigator.navigate(location, this.options);
  }

  public navigateToLatLong(latLong: number[]) {
    this.launchNavigator.navigate(latLong, this.options);
  }
}
