import { DatabaseProvider } from './../providers/database/database';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = null;

  constructor(public dbProvider: DatabaseProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();

      this.dbProvider.createDatabase()
        .then(() => {
          this.openHomePage(splashScreen);  
          console.log('chamou createDatabase() com sucesso');
        })
        .catch((e) => {
          console.log('falhou ao chamar createDatabase(): ' + e)
          this.openHomePage(splashScreen);
        });
    });
  }

  private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.rootPage = HomePage;
  }
}

