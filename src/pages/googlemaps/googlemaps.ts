import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleMaps } from '../../providers/google-maps';
import { PageUtility } from '../page.utility';
import { Location } from '../../providers/location';



/*
  Generated class for the Googlemaps page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-googlemaps',
  templateUrl: 'googlemaps.html'
})
export class GooglemapsPage {


  @ViewChild('map') mapElement;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private pageUtility: PageUtility, private location: Location, public maps: GoogleMaps) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GooglemapsPage');

    this.pageUtility.showLoader('Loading  the map...');

    this.maps.initMap(this.mapElement.nativeElement).then((result) => {
      this.pageUtility.loading.dismiss();

    }, (err) => {
      //this.pageUtility.showMsg('Error', err);
    });

    //this.pageUtility.loading.dismiss();

    console.log('ionViewDidLoad GooglemapsPage');
  }

}
