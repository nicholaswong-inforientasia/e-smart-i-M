import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import 'rxjs/add/operator/map';

/*
  Generated class for the BarcodeScanner provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Barcode {

  Barcode;

  constructor(private http: Http, private barcodeScanner: BarcodeScanner) {
    console.log('Hello BarcodeScanner Provider');
  }

  scan() {

    return new Promise((resolve, reject) => {
      let options = {
        'preferFrontCamera': false,
        'prompt': 'Place a barcode inside the scan area',
        'orientation': 'portrait'
      };

      this.barcodeScanner.scan(options).then((result) => {
        this.Barcode = result.text;
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

}