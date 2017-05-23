import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Site } from './site';
import { Config } from './config';
import { Authentication } from './authentication';
import { Database } from './database';
import 'rxjs/add/operator/map';

/*
  Generated class for the BOMActual provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BOMActual {

  NetworkElementList;
  ActualConfigListAsPlan;
  ActualConfigListNew;
  ActualConfigList;
  ActualConfig;
  ActualConfigSearchList;
  MaterialList;
  MaterialSerialNumberList;
  ExtraMaterialList;
  ExtraMaterialNetworkElementList;
  ExtraMaterialSearchList;
  ExtraMaterialAdd;
  ExtraMaterialSerialNumberList;

  constructor(private http: Http, private site: Site, private config: Config, private authentication: Authentication, private database: Database) {
    console.log('Hello BOMActual Provider');
  }

  getNetworkElementList() {
    return new Promise((resolve, reject) => {
      let onlineCommand = "uspnelist '" + this.site.SOWId + "'";
      let offlineCommand = "uspnelist '" + this.site.SOWId + "'";

      this.database.query(onlineCommand, offlineCommand).then((data) => {
        this.NetworkElementList = data[0];
        resolve();
      }, (err) => {
        reject(err.msg);
      });
    });
  }

  chkBOMActualValidation() {
    return new Promise((resolve, reject) => {
      let command = "exec ACPBOMActValidate '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {
            let isReady = data[0][0].isready;
            //let completed = data[0][0].completed;

            if (isReady === 0)
              reject('BOM Actual is not ready for data entry.');
            else
              resolve();
          } else {
            reject('getNetworkElementList for site ' + this.site.No + ' not found.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualConfigListAsPlan(networkElement) {
    return new Promise((resolve, reject) => {
      let command = "select distinct NEDesc,X_PlanConfig,L2sno,SBID from ACPBOMOnline where sowid = '" + this.site.SOWId + "' and NEDesc = '" + networkElement + "' and SBID <> '0'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ActualConfigListAsPlan = data[0];
          console.log(this.ActualConfigListAsPlan);
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualConfigListNew(networkElement) {
    return new Promise((resolve, reject) => {
      let command = "select distinct NEDesc,X_PlanConfig,L2sno,SBID from ACPBOMOnline where sowid = '" + this.site.SOWId + "' and NEDesc = '" + networkElement + "' and SBID = '0'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ActualConfigListNew = data[0];
          console.log(this.ActualConfigListNew);
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getLevel2ConfigList(networkElement) {
    return new Promise((resolve, reject) => {
      let command = " level2config '" + networkElement + "'," + this.authentication.User.USRID + ",'" + this.site.SOWId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ActualConfigList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualMaterialList(networkElement, configId, SBId) {
    return new Promise((resolve, reject) => {
      let command = " ACPBOMOnlineList '" + configId + "','" + networkElement + "','" + this.site.SOWId + "',1,'" + SBId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.MaterialList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualMaterialSerialNumberList(mcId, sbId) {
    return new Promise((resolve, reject) => {
      let command = " ACPBOMActSerialPOPList  " + mcId + ",'" + this.site.SOWId + "','" + sbId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.MaterialSerialNumberList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBOMActualMaterialDetail(mcId, planQty, reUsedQty, newQty, remarks, configId, sbId) {
    return new Promise((resolve, reject) => {

      let delta = newQty - planQty;
      let command = "ACPBOMOnlineUpdate " + mcId + " ,'" + this.site.SOWId + "'," + reUsedQty + "," + newQty + "," + delta + ", '" + remarks + "',1544,'"
        + this.authentication.User.NAME + "','', '', " + configId + ",'" + sbId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {

          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBOMActualMaterialDetailSerialNumber(materialDetail, details, mcId, sbId) {
    return new Promise((resolve, reject) => {
      let sql = '';
      details.forEach(item => {
        sql = sql + "select distinct " + mcId + ",~" + this.site.SOWId + "~,~NewEPQ~,~" + item.serialnumber + "~,~~,~" + item.remarks + "~,~" + this.authentication.User.NAME + "~,~" + sbId + "~ UNION ALL ";
      });
      sql = sql.substr(0, sql.length - 11);

      let command = "ACPBOMActSerialPOPInsert " + mcId + " ,'" + this.site.SOWId + "', '" + sbId + "', '" + sql + "'";
      command = command + ' SELECT 1 AS Rows';
      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0][0].Rows > 0) {
            materialDetail.serialnumber = "View";
            resolve();
          } else {
            reject('setBOMActualMaterialDetailSerialNumber for site ' + this.site.No + ' failed.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualConfigSearchList(networkElement) {
    return new Promise((resolve, reject) => {
      let command = "acpgetnewconfig '" + networkElement + "','" + this.site.SOWId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ActualConfigSearchList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBOMActualConfigAddDetail(NEId, L2SNo, PONo, qty) {
    return new Promise((resolve, reject) => {

      let command = "acpaddnewconfig " + NEId + ", " + L2SNo + ",'" + this.site.SOWId + "','" + this.authentication.User.NAME + "','" + PONo + "'," + qty;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {

          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  delBOMActualConfig(NEDesc, L2SNo) {
    return new Promise((resolve, reject) => {

      let command = " acpdeletenewconfig '" + NEDesc + "', " + L2SNo + ",'" + this.site.SOWId + "','" + this.authentication.User.NAME + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {

          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualExtraMaterialList() {
    return new Promise((resolve, reject) => {
      let command = "ACPGETMaterialsX '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ExtraMaterialList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualExtraMaterialSearchList(networkElement) {
    return new Promise((resolve, reject) => {
      let command = "ACPXMaterialslist " + networkElement + ",'" + this.site.SOWId + "' ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ExtraMaterialSearchList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualExtraMaterialAdd(materialid, NEId) {
    return new Promise((resolve, reject) => {

      let command = " ACPADDMaterials '" + materialid + "','" + NEId + "','" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ExtraMaterialAdd = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  delBOMActualExtraMaterial(sNo) {
    return new Promise((resolve, reject) => {

      let command = " ACPDeleteBOMOnlineX  " + sNo + "," + this.authentication.User.USRID;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBOMActualExtraMaterialSerialNumberList(mcId) {
    return new Promise((resolve, reject) => {
      let command = " ACPBOMActSerialPOPXList  " + mcId + ",'" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ExtraMaterialSerialNumberList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBOMActualExtraMaterialDetailSerialNumber(materialDetail, details, mcId) {
    return new Promise((resolve, reject) => {
      let sql = '';
      details.forEach(item => {
        sql = sql + "select distinct " + mcId + ",~" + this.site.SOWId + "~,~NewEPQ~,~" + item.serialnumber + "~,~~,~" + item.remarks + "~,~" + this.authentication.User.NAME + "~ UNION ALL ";
      });
      sql = sql.substr(0, sql.length - 11);

      let command = "ACPBOMActSerialPOPXInsert " + mcId + " ,'" + this.site.SOWId + "', '" + sql + "'";
      command = command + ' SELECT 1 AS Rows';
      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0][0].Rows > 0) {
            materialDetail.serialno[0] = "View";
            resolve();
          } else {
            reject('setBOMActualMaterialDetailSerialNumber for site ' + this.site.No + ' failed.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBOMActualExtraMaterialDetail(materialDetail, NEId) {
    return new Promise((resolve, reject) => {
      let sql = '';

      if (NEId > 0) {
        materialDetail.forEach(item => {
          sql = sql + "select " + item.mcid + ",~" + this.site.SOWId + "~,~" + item.NEelement + "~,~" + item.reusedqty + "~,~ " + item.newqty + "~,~" + item.refnotype + "~,~" + item.refno + "~,~~,~" + this.authentication.User.NAME + "~  union all ";
        });
      }

      this.ExtraMaterialList.forEach(item => {
        sql = sql + "select " + item.mcid + ",~" + this.site.SOWId + "~,~" + item.NEelement + "~,~" + item.reusedqty + "~,~ " + item.newqty + "~,~" + item.refnotype + "~,~" + item.refno + "~,~" + item.remarks + "~,~" + this.authentication.User.NAME + "~  union all ";
      });

      sql = sql.substr(0, sql.length - 11);

      let command = "ACPBOMOnlineXInsert '" + this.site.SOWId + "', '" + sql + "'";
      command = command + ' SELECT 1 AS Rows';
      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0][0].Rows > 0) {
            if (NEId > 0)
              materialDetail[0].serialno = "View";
            else
              materialDetail.serialno[0] = "View";
            resolve();
          } else {
            reject('setBOMActualExtraMaterialDetail for site ' + this.site.No + ' failed.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getExtraMaterialNetworkElementList() {
    return new Promise((resolve, reject) => {
      let command = "ACPDDLNE '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ExtraMaterialNetworkElementList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

}