import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
//import { NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Config } from './config';
import { Md5 } from 'ts-md5/dist/md5';
//import { GeoFence } from './geo-fence';
// import { LocationValidationPage } from '../pages/location-validation/location-validation';
import 'rxjs/add/operator/map';

/*
  Generated class for the Authentication provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Authentication {

  Token;
  User;

  constructor(private http: Http, private storage: Storage, private config: Config) {
    console.log('Hello Authentication Provider');
  }

  checkAuthentication() {

    return new Promise((resolve, reject) => {

      //Load token if exists
      this.storage.get('token').then((value) => {

        this.Token = value;

        let headers = new Headers();
        headers.append('Authorization', this.Token);

        this.http.get(this.config.queryApiUrl + '/auth/protected', { headers: headers })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });

      });

    });

  }

  createAccount(details) {

    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post(this.config.queryApiUrl + '/auth/register', JSON.stringify(details), { headers: headers })
        .subscribe(res => {

          let data = res.json();
          this.Token = data.token;
          this.storage.set('token', data.token);
          resolve(data);
        }, (err) => {
          reject(err);
        });

    });

  }

  login(credentials) {
    return new Promise((resolve, reject) => {
      credentials.password = Md5.hashStr(credentials.password + 'TAKE');
      let command = "exec uspValidateLogin @USRLogin=N'" + credentials.username + "',@USRPassword=N'" + credentials.password + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {

            this.User = data[0][0];
            this.storage.set('user', this.User);
            resolve();
          } else {
            reject('Login failed. Please check username/password.');
          }
        }, (err) => {
          reject(err._body);
        });
    });

  }

  logout() {
    this.storage.set('token', '');
    // this.geoFence.setGeoFenceLog("Logout", "Menu logout");
    // this.menuCtrl.close();
    // this.navCtrl.setRoot(LocationValidationPage);
  }

}