import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Site } from './site';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

/*
  Generated class for the Location provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Location {

  Latitude;
  Longitude;
  GeoFenceLimit;
  AppVersion;
  PhotoQuality;

  constructor(private http: Http, private config: Config, private site: Site, private diagnostic: Diagnostic, private geolocation: Geolocation) {
    console.log('Hello Location Provider');
  }

  getGpsLocationAvailable() {

    return new Promise((resolve, reject) => {

      let successCallback = (isAvailable) => {
        let gpsLocationAvailable = isAvailable;
        if (gpsLocationAvailable)
          resolve();
        else {
          reject('GPS is disabled, please turn on GPS.');
          this.diagnostic.switchToLocationSettings();
        }
      };
      let errorCallback = (error) => {
        reject(error);
      }
      this.diagnostic.isGpsLocationAvailable().then(successCallback).catch(errorCallback);
    });
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {

      this.geolocation.getCurrentPosition()
        .then((position) => {

          let currentPosition = position;
          this.Latitude = currentPosition.coords.latitude;
          this.Longitude = currentPosition.coords.longitude;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    console.log("L1:" + lat1 + "," + lon1);
    console.log("L2:" + lat2 + "," + lon2);

    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    console.log(d);
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getGeoFenceLimit() {
    return new Promise((resolve, reject) => {
      let command = "getsettings ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {
            this.GeoFenceLimit = data[0][0].geofencelimit;
            this.AppVersion = data[0][0].appversion;
            this.PhotoQuality = data[0][0].quality;
            resolve();
          } else {
            reject('Geo fence limit not found.');
          }
        }, (err) => {
          reject(err._body);
        });

    });
  }

  validateSecurityCode(securityCode) {
    return new Promise((resolve, reject) => {
      let command = "select count(1) count from mobilegpsbypasscode where sowid = '" + this.site.SOWId + "' and gpscode='" + securityCode + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {
            if (data[0][0].count > 0)
              resolve();
            else
              reject('Security Code is not valid.');
          } else {
            reject('Geo fence limit not found.');
          }
        }, (err) => {
          reject(err._body);
        });

    });
  }




}