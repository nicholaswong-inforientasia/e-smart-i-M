import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { Config } from './config';
import { ProviderUtility } from './provider.utility';

import 'rxjs/add/operator/map';

/*
  Generated class for the FileTransfer provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FileTransfer {

  fileTransfer: TransferObject = this.transfer.create();

  constructor(private http: Http, private config: Config, private providerUtility: ProviderUtility, private transfer: Transfer) {
    console.log('Hello FileTransfer Provider');
  }

  upload(fileKey, filePath: string) {
    return new Promise((resolve, reject) => {

      let file = filePath.split('/');
      let options: FileUploadOptions = {
        fileKey: fileKey,
        fileName: file[file.length - 1]
      }

      let url = this.config.uploadApiUrl + fileKey + '/';
      console.log(url);
      this.fileTransfer.upload(filePath, url, options)
        .then((data) => {
          // success
          resolve();
        }, (err) => {
          // error
          reject(err);
        })
    });
  }

  download(url, filePath) {
    return new Promise((resolve, reject) => {

      url = this.providerUtility.replace(url, " ", "%20");

      this.fileTransfer.download(url, filePath).then((entry) => {
        console.log('download complete: ' + entry.toURL());
        resolve();
      }, (err) => {
        reject(url + " not found.");
      });

    });
  }

}