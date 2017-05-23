import { Component } from '@angular/core';
import { PageUtility } from '../page.utility';
import { Authentication } from '../../providers/authentication';
import { HomePage } from '../home/home';
import { GeoFence } from '../../providers/geo-fence';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  credentials = {
    username: '',
    password: ''
  };

  constructor(private pageUtility: PageUtility, private authentication: Authentication, private geoFence: GeoFence) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.pageUtility.showLoader('Login...');

    this.authentication.login(this.credentials).then((result) => {
      this.geoFence.addGeofence();
      this.geoFence.validateMEIDMDN().then((result) => {
        this.pageUtility.loading.dismiss();
        this.pageUtility.navCtrl.setRoot(HomePage);

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}