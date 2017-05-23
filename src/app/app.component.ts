import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Database } from '../providers/database';
import { Config } from '../providers/config';
// import { GeoFence } from '../providers/geo-fence';
import { PunchList } from '../providers/punch-list';
import { LocationValidationPage } from '../pages/location-validation/location-validation';
import { HomePage } from '../pages/home/home';
import { PunchListPage } from '../pages/punch-list/punch-list';
import { BOMActualPage } from '../pages/bom-actual/bom-actual';
import { ATPRANDocumentPage } from '../pages/atpran-document/atpran-document';
import { GooglemapsPage } from '../pages/googlemaps/googlemaps';
import { SignaturePage } from '../pages/signature/signature';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LocationValidationPage;

  pages: Array<{ title: string, component: any }>;

  disabled = false;

  constructor(private platform: Platform, private menuCtrl: MenuController, private alertCtrl: AlertController, private splashScreen: SplashScreen, private statusBar: StatusBar, private database: Database, private config: Config, private punchList: PunchList) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Site Information', component: HomePage },
      { title: 'ATP RAN Documents', component: ATPRANDocumentPage },
      { title: 'Punch List', component: PunchListPage },
      { title: 'BOM Actual', component: BOMActualPage },
      { title: 'Map', component: GooglemapsPage },
      { title: 'Signature', component: SignaturePage },
      { title: 'Clear Photo Cache', component: SignaturePage }
      // { title: 'Update App', component: SignaturePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
      this.statusBar.styleDefault();

      this.database.createDB().then((res) => {
        this.database.initSqliteDB();

        this.config.validateAppVersion().then((res) => {
          this.disabled = false;

        }, (err) => {
          this.disabled = true;
          //this.showUpdateMsg('Error', err);

        });

      }, (err) => {
        console.log(err);
      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    switch (page.title) {
      case "Clear Photo Cache": {
        this.punchList.getPhotoCacheFiles().then(() => {
          console.log(this.punchList.PhotoCacheList);
          this.showConfirm("Clear Photo Cache", "There are " + this.punchList.PhotoCacheList.length + " photos. Do you want to clear photo cache?");
        }, (err) => {
          this.showMsg('Error', err);
        });
        break;
      }
      case "Update App": {
        // this.geoFence.updateApp().then((result) => {
        //   this.showMsg('Success', result);
        // }, (err) => {
        //   this.showMsg('Error', err);
        // });
        break;
      }
      default: {
        this.nav.setRoot(page.component);
        break;
      }
    }
  }

  clearPhotoCache() {
    this.punchList.clearPhotoCache(this.punchList.PhotoCacheList).then((result) => {
      console.log(result);
      this.showMsg('Success', 'Photo cache cleared.');
    }, (err) => {
      console.log(err);
      this.showMsg('Error', err);
    });
  }


  showConfirm(title, msg) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.clearPhotoCache();
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  showMsg(title, msg) {
    console.log(msg);
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  logout() {
    // this.geoFence.setGeoFenceLog("Logout", "Menu logout");
    this.menuCtrl.close();
    this.nav.setRoot(LocationValidationPage);
  }


}
