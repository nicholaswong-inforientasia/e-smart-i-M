import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Config } from './config';
import { Database } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the Site provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Site {

  No;
  SOWId;
  Name;
  PONo;
  Phase;
  Scope;
  VendorName;
  Region;
  Latitude;
  Longitude;
  Distance;

  siteColumnHeaders;
  siteColumnValues;

  constructor(private http: Http, private config: Config, private database: Database) {
    console.log('Hello Site Provider');
  }

  getSiteDetails() {
    return new Promise((resolve, reject) => {
      let command = `SELECT TOP 1 pd.SiteNo, pd.SiteName, pd.SOWId, pd.PONo, pd.Phase, pd.Scope, pd.VendorName, sm.LalitudeDegrees, sm.LongitudeDegrees,
                    (select RGNName from codRegion where RGN_ID = pd.RGN_Id) Region
                    FROM projectdata pd INNER JOIN sitemaster sm ON pd.SiteId = sm.SiteId
                    WHERE pd.siteno = '` + this.No + `' AND pd.ProcessId = 17
                    ORDER BY pd.ATPDate DESC`

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {

            this.No = data[0][0].SiteNo;
            this.Name = data[0][0].SiteName;
            this.SOWId = data[0][0].SOWId;
            this.PONo = data[0][0].PONo;
            this.Phase = data[0][0].Phase;
            this.Scope = data[0][0].Scope;
            this.VendorName = data[0][0].VendorName;
            this.Region = data[0][0].Region;
            this.Latitude = data[0][0].LalitudeDegrees;
            this.Longitude = data[0][0].LongitudeDegrees;

            resolve();
          } else {
            reject('Site ' + this.No + ' not found.');
          }
        }, (err) => {
          reject(err._body);
        });

    });
  }

  getMoreSiteDetails() {
    return new Promise((resolve, reject) => {
      let command = "getmobilesiteinfo '" + this.SOWId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {
            this.siteColumnHeaders = data[0];
            this.siteColumnValues = data[1][0];
            resolve();
          } else {
            reject('Site ' + this.No + ' not found.');
          }
        }, (err) => {
          reject(err._body);
        });

    });
  }

  setMoreSiteDetails(siteColumnHeaders, siteColumnValues) {
    return new Promise((resolve, reject) => {

      let sql = "";
      let i = 0;
      siteColumnHeaders.forEach(columnHeader => {
        sql = sql + columnHeader.infocolumn + "='" + siteColumnValues[columnHeader.infocolumn] + "', ";
        i = i + 1;
      });

      sql = sql.substr(0, sql.length - 2);
      let command = "update ACPAtpRAN set " + sql + " where SOWID = '" + this.SOWId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });

    });
  }

  // getSiteDetails() {
  //   return new Promise((resolve, reject) => {
  //     let command = `getmobilesiteinfo '` + this.SOWId + `'`

  //     this.http.get(this.config.queryApiUrl + command)
  //       .subscribe(res => {
  //         let data = res.json();
  //         if (data[0].length > 0) {

  //           this.No = data[0][0].SiteNo;
  //           this.Name = data[0][0].ClusterType;
  //           this.SOWId = data[0][0].SFEngineer;
  //           this.PONo = data[0][0].SiteNo;
  //           this.Phase = data[0][0].Cluster;
  //           this.Scope = data[0][0].ClusterType;
  //           this.VendorName = data[0][0].SFEngineer;
  //           this.Latitude = data[0][0].SiteEntineer;
  //           this.Longitude = data[0][0].SiteNo;
  //           this.VendorName = data[0][0].TestDate;
  //           this.Latitude = data[0][0].TestDesc;



  //           resolve();
  //         } else {
  //           reject('Site ' + this.No + ' not found.');
  //         }
  //       }, (err) => {
  //         reject(err._body);
  //       });

  //   });
  // }

}