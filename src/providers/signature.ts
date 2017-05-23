import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Site } from './site';
import { Config } from './config';
import { Authentication } from './authentication';
import { ProviderUtility } from './provider.utility';
import 'rxjs/add/operator/map';

/*
  Generated class for the Signature provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Signature {
  signatureData;


  constructor(private http: Http, private site: Site, private config: Config, private authentication: Authentication, private providerUtility: ProviderUtility) {
    console.log('Hello Signature Provider');
  }

  //to get stored signature data
  getsignatureData() {
    return new Promise((resolve, reject) => {
      let command = "select [Field Engineer Signature] from M101V1NE1EX1 where sowid='" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.signatureData = data[0][0]["Field Engineer Signature"];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  //to store signature data
  setnewSignatureData() {
    return new Promise((resolve, reject) => {

      let command = "if not exists(select [Field Engineer Signature] from M101V1NE1EX1 where sowid='" + this.site.SOWId + "') " +
        "insert into M101V1NE1EX1 (sowid,LMBY,LMDT,[Field Engineer Signature]) values ('" + this.site.SOWId + "','" + this.authentication.User.USRID + "',getdate(),'" + this.signatureData + "') " +
        "else " +
        "update M101V1NE1EX1 set [Field Engineer Signature]='" + this.signatureData + "',LMBY='" + this.authentication.User.USRID + "',LMDT=getdate() where sowid='" + this.site.SOWId + "' " +
        "update InfoPMDefaultValue set data='" + this.signatureData + "' where pmid=84";

      command = this.providerUtility.convertToAPISafeChars(command);
      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {

          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

}
