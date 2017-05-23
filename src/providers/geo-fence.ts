import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ProviderUtility } from './provider.utility';
import { AppUpdate } from '@ionic-native/app-update';
import { Geofence } from '@ionic-native/geofence';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
import { Config } from './config';
import { Database } from './database';
import { Location } from './location';
import { Site } from './site';
import { Authentication } from './authentication';
// import { LocationValidationPage } from '../pages/location-validation/location-validation';
import { PageUtility } from '../pages/page.utility';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeoFence provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeoFence {

  MEID;
  PhoneNum;
  AppName;
  VersionCode;
  VersionNumber;
  LatestAppVersion;
  CurrentAppVersion;

  constructor(private http: Http, private providerUtility: ProviderUtility, private geofence: Geofence, private location: Location, private site: Site, private config: Config, private database: Database, private authentication: Authentication, private pageUtility: PageUtility, private appVersion: AppVersion, private device: Device, private sim: Sim, private appUpdate: AppUpdate) {
    console.log('Hello GeoFence Provider');

    sim.getSimInfo().then(
      (info) => {
        this.MEID = info.deviceId;
        console.log(this.MEID);
      },
      (err) => console.log('Unable to get sim info: ', err)
    );

    appVersion.getAppName().then((appName) => {
      this.AppName = appName;
      console.log(this.AppName);
      appVersion.getVersionCode().then((versionCode) => {
        this.VersionCode = versionCode;
        console.log(this.VersionCode);
        appVersion.getVersionNumber().then((versionNumber) => {
          this.VersionNumber = versionNumber;
          console.log(this.VersionNumber);
        });
      });
    });

    // initialize the plugin
    geofence.initialize().then(
      // resolved promise does not return a value
      () => console.log('Geofence Plugin Ready'),
      (err) => console.log(err)
    )

  }


  updateApp() {
    return new Promise((resolve, reject) => {
      const updateUrl = this.config.smartWebsiteUrl + 'apk/update.xml';
      this.appUpdate.checkAppUpdate(updateUrl).then((result) => {
        if (result.code === 202)
          resolve('App is the latest.');
        else
          resolve('App updated.');
      }, (err) => {
        reject(err.msg);
      });
    });
  }


  addGeofence() {
    //options describing geofence
    let fence = {
      id: this.providerUtility.generateUUID(), //any unique ID
      latitude: this.site.Latitude, //center of geofence radius
      longitude: this.site.Longitude,
      radius: this.location.GeoFenceLimit, //m
      transitionType: this.geofence.TransitionType.BOTH
    }

    this.geofence.removeAll().then(
      () => console.log('Geofence removeAll'),
      (err) => console.log('Geofence failed to removeAll')
    );

    this.geofence.addOrUpdate(fence).then(
      () => console.log('Geofence added'),
      (err) => console.log('Geofence failed to add')
    );


    console.log(this.device);

    this.geofence.onTransitionReceived().subscribe(res => {

      res.forEach(data => {
        if (data.transitionType === 1) {
          console.log("Geofence transition enter", data);
          this.setGeoFenceLog("Login", "Location Validation");
        }

        if (data.transitionType === 2) {
          console.log("Geofence transition exit", data);
          this.setGeoFenceLog("Logout", "Location Validation");
          this.pageUtility.showMsg('Error', 'Forced logout due to Current location is not within ' + this.location.GeoFenceLimit + ' m radius of Site location.');
          this.pageUtility.logout();
        }

        if (data.transitionType === 3) {
          console.log("Geofence transition both", data);
          this.setGeoFenceLog("Both", "Location Validation");
        }
      });
    });
  }

  setGeoFenceLog(userAction, pageName) {
    return new Promise((resolve, reject) => {
      this.location.getCurrentLocation().then((res) => {
        let distance = this.location.getDistanceFromLatLonInKm(this.site.Latitude, this.site.Longitude, this.location.Latitude, this.location.Longitude);

        this.appVersion.getAppName().then((appName) => {
          this.AppName = appName;
          console.log(this.AppName);
          this.appVersion.getVersionCode().then((versionCode) => {
            this.VersionCode = versionCode;
            console.log(this.VersionCode);
            this.appVersion.getVersionNumber().then((versionNumber) => {
              this.VersionNumber = versionNumber;
              console.log(this.VersionNumber);

              let command = "uspsmartuserlogM " + this.authentication.User.USRID + ",'" + userAction + "','" + pageName + "','" + this.site.No + "','" + this.site.Name + "','" +
                this.site.Latitude + "','" + this.site.Longitude + "','" + this.location.Latitude + "','" + this.location.Longitude + "'," + distance.toLocaleString() + ",'" +
                this.AppName + " " + this.VersionNumber + "','" +
                this.device.manufacturer + " " + this.device.model + " (" + this.device.platform + " " + this.device.version + ")','" + this.MEID + "'";

              this.http.get(this.config.queryApiUrl + command)
                .subscribe(res => {
                  resolve();
                }, (err) => {
                  reject(err._body);
                });
            });
          });
        });

      }, (err) => {
        reject(err._body);
      });
    });
  }

  validateMEIDMDN() {
    return new Promise((resolve, reject) => {

      this.sim.getSimInfo().then(
        (info) => {
          console.log('Sim info: ', info);
          this.MEID = info.deviceId;
          this.PhoneNum = info.phoneNumber;

          let command = "select count(1) count from ebastusers where usrid='" + this.authentication.User.USRID + "' and meid = '" + this.MEID + "'";

          this.http.get(this.config.queryApiUrl + command)
            .subscribe(res => {
              let data = res.json();
              if (data[0].length > 0) {
                if (data[0][0].count > 0)
                  resolve();
                else
                  reject('MEID: ' + this.MEID + ' not authorised.');
              }
            }, (err) => {
              reject(err._body);
            });
        },
        (err) => console.log('Unable to get sim info: ', err)
      );
    });
  }



}