import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Site } from './site';
import { Config } from './config';
import { Authentication } from './authentication';
import { ProviderUtility } from './provider.utility';
import 'rxjs/add/operator/map';
import xml2js from 'xml2js';

/*
  Generated class for the ATPRANDocument provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ATPRANDocument {

  documentList;
  networkElementList;
  exhibitList;
  documentName;
  metaDocList;
  tableDetails;
  header;
  rsItems;
  referencePhotos;
  actualPhotos;

  constructor(private http: Http, private site: Site, private config: Config, private authentication: Authentication, private providerUtility: ProviderUtility) {
    console.log('Hello ATPRANDocument Provider');
  }

  getDocumentList() {
    return new Promise((resolve, reject) => {
      let command = "uspGetMetadocVNList";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.documentList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getNetworkElementList() {
    return new Promise((resolve, reject) => {
      let command = "ddlnesite '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.networkElementList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getExhibitList(networkElementId) {
    return new Promise((resolve, reject) => {
      let command = "ddlexhibit '" + networkElementId + "','" + this.site.VendorName + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.exhibitList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getMetaDocList(documentId, networkElementId, exhibitId) {
    return new Promise((resolve, reject) => {
      let command = "uspGetMetaDoc " + documentId + ",'" + this.site.VendorName + "'," + networkElementId + ",'" + this.site.SOWId + "'," + exhibitId;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.documentName = data[0][0].docname;
          this.metaDocList = data[1];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getTableDetails(tableId) {
    return new Promise((resolve, reject) => {
      let command = "gettabledetails " + tableId + ",'" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.tableDetails = data[0];
          this.header = data[1][0].header.split(',');
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getRSItems(xmlId) {
    return new Promise((resolve, reject) => {
      let file = "xml_" + xmlId + ".xml";

      this.http.get(this.config.smartWebsiteUrl + this.config.metaXmlPath + file)
        .map(res => res.text())
        .subscribe(data => {

          this.parseXML(data)
            .then((data) => {
              this.rsItems = data;
              resolve();
            }, (err) => {
              reject(err);
            });

        }, (err) => {
          reject(err._body);
        });
    });
  }

  parseXML(data) {
    return new Promise((resolve, reject) => {
      let parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: false
        });

      parser.parseString(data, function (err, result) {
        if (err)
          reject(err);
        resolve(result.NewDataSet.Table);
      });
    });
  }

  setUpdateTransactionData(metaTable, mobile) {
    return new Promise((resolve, reject) => {
      let sql = '';
      let tableId;

      metaTable.forEach(item => {
        sql = sql + ' sairam ~' + this.site.SOWId + '~,~' + item.item.metatablesno + '~,';
        item.header.forEach(header => {
          if (!header.startsWith('ST'))
            sql = sql + '~' + this.providerUtility.convertToDBSafeChars(item.item[header]) + "~,";
        });
        sql = sql.substr(0, sql.length - 1);
        sql = sql + " union ";
        tableId = item.tableId;
      });

      let command = "UpdateTransactionData '" + tableId + "','" + sql + "','" + this.site.SOWId + "','" + this.authentication.User.NAME + "'," + mobile;
      command = this.providerUtility.convertToAPISafeChars(command);

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getReferencePhotos(tableId, metaTableSNo) {
    return new Promise((resolve, reject) => {
      let command = " getrefphotos " + tableId + "," + metaTableSNo + ",'" + this.config.smartWebsiteUrl + "SmartfrenDemoDoc/RefPhoto/'";
      command = this.providerUtility.convertToAPISafeChars(command);

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.referencePhotos = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getActualPhotos(tableId, metaTableSNo) {
    return new Promise((resolve, reject) => {
      let command = " getactphotos " + tableId + "," + metaTableSNo + ",'" + this.config.smartWebsiteUrl + "SmartfrenDemoDoc/ActPhoto/'";
      command = this.providerUtility.convertToAPISafeChars(command);

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.actualPhotos = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setActualPhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = "insert into actualphotos values (" + photo.tableId + "," + photo.metatablesno + ",'" + this.providerUtility.getFileName(photo.photopath) + "','" + photo.photoattr + "')";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  delActualPhoto(sno) {
    return new Promise((resolve, reject) => {
      let command = "delete from actualphotos where sno = " + sno;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  updActualPhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = "update actualphotos set photoattr = '" + photo.photoattr + "' where sno = " + photo.sno;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

}
