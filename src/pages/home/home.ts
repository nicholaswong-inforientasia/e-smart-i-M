import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Site } from '../../providers/site';
import { LocationValidationPage } from '../location-validation/location-validation';
import { PageUtility } from '../page.utility';

/*
  Generated class for the Home page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private site: Site, private pageUtility: PageUtility) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.site.getMoreSiteDetails().then((res) => {
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    console.log(this.site.siteColumnHeaders);
    console.log(this.site.siteColumnValues);
  }

  public logout() {
    this.navCtrl.setRoot(LocationValidationPage);
  }

  saveInfo() {
    this.site.setMoreSiteDetails(this.site.siteColumnHeaders, this.site.siteColumnValues).then((res) => {
      this.pageUtility.showMsg('Success', 'Site Information saved.');

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

  }

}