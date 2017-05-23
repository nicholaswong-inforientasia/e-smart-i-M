import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { PageUtility } from '../page.utility';
import { Location } from '../../providers/location';
import { LoginPage } from '../login/login';
import { Site } from '../../providers/site';
import { GeoFence } from '../../providers/geo-fence';

/*
  Generated class for the LocationValidation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-location-validation',
  templateUrl: 'location-validation.html'
})
export class LocationValidationPage {

  siteNo;
  disabled;

  constructor(private pageUtility: PageUtility, private location: Location, private site: Site, private geoFence: GeoFence, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationValidationPage');
  }

  validateLocation(bypass) {
    if (bypass !== true)
      this.pageUtility.showLoader('Validating Location...');
    else
      this.pageUtility.showLoader('Validating Bypass Code...');

    this.site.No = this.siteNo;
    this.site.getSiteDetails().then((res) => {

      this.site.getMoreSiteDetails().then((res) => {

        this.location.getGpsLocationAvailable().then((res) => {

          this.location.getCurrentLocation().then((res) => {

            this.site.Distance = this.location.getDistanceFromLatLonInKm(this.location.Latitude, this.location.Longitude, this.site.Latitude, this.site.Longitude);

            this.location.getGeoFenceLimit().then((res) => {

              if (this.site.Distance < this.location.GeoFenceLimit / 1000 || bypass === true) {
                if (this.pageUtility.loading !== undefined)
                  this.pageUtility.loading.dismiss();
                this.pageUtility.navCtrl.setRoot(LoginPage);
              } else {
                this.pageUtility.showMsg('Error', 'Current location is not within ' + this.location.GeoFenceLimit + ' m radius of Site location, please confirm site location.');
              }
            }, (err) => {
              this.pageUtility.showMsg('Error', err);
            });
          }, (err) => {
            this.pageUtility.showMsg('Error', err);
          });
        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  validateSecurityCode() {
    this.site.No = this.siteNo;
    this.site.getSiteDetails().then((res) => {
      this.showPrompt();
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }


  showPrompt() {
    let alert = this.pageUtility.alertCtrl.create({
      title: 'Enter Security Code',
      inputs: [
        {
          name: 'securityCode',
          placeholder: 'Security Code'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Validate',
          handler: data => {

            this.location.validateSecurityCode(data.securityCode).then((res) => {
              this.validateLocation(true);

            }, (err) => {
              this.pageUtility.showMsg('Error', err);
            });

          }
        }
      ]
    });
    alert.present();
  }


  showUpdateMsg(title, msg) {
    console.log(msg);

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.geoFence.updateApp().then((res) => {
              this.pageUtility.showMsg('Success', res)
            }, (err) => {
              this.pageUtility.showMsg('Error', err);
            });
          }
        }]
    });
    alert.present(prompt);
  }

}