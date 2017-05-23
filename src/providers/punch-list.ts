import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { File } from '@ionic-native/file';
import { Config } from './config';
import { Site } from './site';
import { Authentication } from './authentication';
import { ProviderUtility } from './provider.utility';
import { FileTransfer } from './file-transfer';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/map';

/*
  Generated class for the PunchList provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PunchList {

  Header = {
    StartDate: '',
    EndDate: '',
    TestDescription: '',
    Visibility: '',
    FCPS: ''
  };
  Details;

  ItemCheckList;
  PhotoList;
  NetworkElementList =
  [
    'ACCESSROUTER',
    'BMSC',
    'E-GUARD',
    'EMS',
    'EMS/NMS',
    'ENB',
    'EPC',
    'EPC+UDC',
    'HSS/UDC',
    'IGW',
    'IOMS',
    'IPBB',
    'IPBBEMS',
    'IPRAN',
    'ISON',
    'MICROWAVE',
    'NETACT',
    'OSS',
    'POWER',
    'RACS',
    'RCS',
    'ROUTER',
    'SYNCH TP 5000',
    'SYNCHTP5000',
    'TX',
    'VAS',
    'VOLTE'
  ];

  PhotoCacheList;
  PhotoQualityLimit;
  BeforePhotoAdded;
  AfterPhotoAdded;

  constructor(private http: Http, private file: File, private config: Config, private site: Site, private authentication: Authentication, private providerUtility: ProviderUtility, private sanitizer: DomSanitizer, private fileTransfer: FileTransfer) {
    console.log('Hello PunchList Provider');
  }

  getPunchListHeader() {
    return new Promise((resolve, reject) => {
      let command = "getatppunchlist '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[1].length > 0) {
            this.Header.StartDate = data[1][0].TestStartDate;
            this.Header.EndDate = data[1][0].TestEndDate;
            this.Header.TestDescription = data[1][0].TestDescription;
            this.Header.Visibility = data[1][0].NMSAspectVisiblity;
            this.Header.FCPS = data[1][0].NMSAspectFCPS;
            resolve();
          } else {
            this.Header.StartDate = '';
            this.Header.EndDate = '';
            this.Header.TestDescription = '';
            this.Header.Visibility = '';
            this.Header.FCPS = '';
            reject('Punch List for site ' + this.site.No + ' not found.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getPunchListDetails() {
    return new Promise((resolve, reject) => {
      let command = "getatppunchlistdetails '" + this.site.SOWId + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.Details = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getItemCheckList(networkElement) {
    return new Promise((resolve, reject) => {
      let command = `SELECT LTRIM(RTRIM(UPPER(Itemcheck))) val, Itemcheck + ' - ' + isnull(Descriptions,'(NO DESCRIPTION)') txt 
                    FROM tblnepunchlistxl 
                    WHERE NetworkElement='` + networkElement + `' AND Vendor='` + this.site.VendorName + `' AND Itemcheck<>'' 
                    ORDER BY txt`;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.ItemCheckList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getItemCheckDesc(val) {
    return new Promise((resolve, reject) => {
      let command = "SELECT Itemcheck + ' - ' + isnull(Descriptions,'(NO DESCRIPTION)') txt FROM tblnepunchlistxl WHERE Itemcheck = '" + val + "'";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          resolve(data[0][0].txt);
        }, (err) => {
          reject(err._body);
        });
    });
  }


  setPunchListHeader() {
    return new Promise((resolve, reject) => {
      let command = `UPDATE ACPPunchMain SET TestStartDate = '` + this.Header.StartDate + `', TestEndDate = '` + this.Header.EndDate + `', TestDescription = '` + this.Header.TestDescription + `', 
                    NMSAspectVisiblity = '` + this.Header.Visibility + `', NMSAspectFCPS = '` + this.Header.FCPS + `' 
                    WHERE SOWID = '` + this.site.SOWId + `'
                    SELECT @@ROWCOUNT AS Rows`;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0][0].Rows > 0) {
            resolve();
          } else {
            reject('setPunchListHeader for site ' + this.site.No + ' failed.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setPunchListDetail(details) {
    return new Promise((resolve, reject) => {
      let sql = '';
      details.forEach(item => {
        let index = details.indexOf(item) + 1;
        sql = sql + 'SELECT ~' + this.site.SOWId + '~,~U~,~' + item.NEOpenIssue + '~,~' + item.OpenIssue + '~,~' + item.Majororminor + '~,~' + this.providerUtility.convertDate(item.Targetclosedate) + '~,~' +
          this.providerUtility.convertDate(item.Issueclosedate) + '~,~' + this.authentication.User.NAME + '~,~' + Date().toString() + '~,~' + this.authentication.User.NAME + '~,~' + index + '~ UNION ';
      });
      sql = sql.substr(0, sql.length - 7);

      let command = "UspACPPunchDetailsI '" + this.site.SOWId + "', '" + sql + "'";
      command = command + ' SELECT 1 AS Rows';
      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0][0].Rows > 0) {
            resolve();
          } else {
            reject('setPunchListDetail for site ' + this.site.No + ' failed.');
          }
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getBeforePhotoList(rowNo) {
    return new Promise((resolve, reject) => {
      let command = `declare @SWId bigint
                      select @SWId = SWId from sitedoc where sowid='`+ this.site.SOWId + `' and docattributes='Punchlist'
                      select Sno, RowNo,Swid, replace(BeforePath,'PLPhotoschrBackslash','filechrColonchrSlashchrSlashchrSlashstoragechrSlashemulatedchrSlash0chrSlashAndroidchrSlashdatachrSlashcom.ionicframework.esmartim497023chrSlashcachechrSlash')  BeforePath, BeforeCaption, BLong,BLat  
                      from ACPPunchlistPhotos   where Swid=@SWId and RowNo=` + rowNo + ` and Rstatus=2 and BeforePath <> '' 
                      order by sno desc`

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.PhotoList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  getAfterPhotoList(rowNo) {
    return new Promise((resolve, reject) => {
      let command = `declare @SWId bigint
                      select @SWId = SWId from sitedoc where sowid='`+ this.site.SOWId + `' and docattributes='Punchlist'
                      select Sno, RowNo,Swid, replace(AfterPath,'PLPhotoschrBackslash','filechrColonchrSlashchrSlashchrSlashstoragechrSlashemulatedchrSlash0chrSlashAndroidchrSlashdatachrSlashcom.ionicframework.esmartim497023chrSlashcachechrSlash')  AfterPath, AfterCaption, ALong,ALat  
                      from ACPPunchlistPhotos   where Swid=@SWId and RowNo=` + rowNo + ` and Rstatus=2 and AfterPath <> '' 
                      order by sno desc`

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          this.PhotoList = data[0];
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setBeforePhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = `declare @SWId bigint
                      select @SWId = SWId from sitedoc where sowid='`+ this.site.SOWId + `' and docattributes='Punchlist'
                      exec ACPPunchlistPhotosInsert ` + photo.RowNo + `,@SWId,'` + 'PLPhotoschrBackslash' + this.providerUtility.getFileName(photo.BeforePath) + `','','` +
        this.authentication.User.NAME + `','` + photo.BeforeCaption + `','','` + photo.BLong + `','` + photo.BLat + `','',''`;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          this.BeforePhotoAdded = true;
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  setAfterPhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = `declare @SWId bigint
                      select @SWId = SWId from sitedoc where sowid='`+ this.site.SOWId + `' and docattributes='Punchlist'
                      exec ACPPunchlistPhotosInsert ` + photo.RowNo + `,@SWId,'','` + 'PLPhotoschrBackslash' + this.providerUtility.getFileName(photo.AfterPath) + `','` +
        this.authentication.User.NAME + `','','` + photo.AfterCaption + `','','','` + photo.ALong + `','` + photo.ALat + `'`;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          this.AfterPhotoAdded = true;
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  updBeforePhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = `update ACPPunchlistPhotos set BeforeCaption = '` + photo.BeforeCaption + `' where Sno = ` + photo.Sno;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  updAfterPhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = `update ACPPunchlistPhotos set AfterCaption = '` + photo.AfterCaption + `' where Sno = ` + photo.Sno;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  delPhoto(photo) {
    return new Promise((resolve, reject) => {
      let command = `update ACPPunchlistPhotos set Rstatus = 0 where Sno = ` + photo;

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          resolve();
        }, (err) => {
          reject(err._body);
        });
    });
  }

  checkBeforePhotosExist(photoFiles) {
    return new Promise((resolve, reject) => {

      photoFiles.forEach(photoFile => {
        this.file.checkFile(this.file.externalCacheDirectory, this.providerUtility.getFileName(photoFile.BeforePath)).then((result) => {
          console.log(photoFile.BeforePath);
          if (photoFiles.indexOf(photoFile) === photoFiles.length - 1)
            resolve();

        }, (err) => {
          this.fileTransfer.download(this.config.smartWebsiteUrl + this.config.punchListPath + this.providerUtility.getFileName(photoFile.BeforePath), photoFile.BeforePath).then((result) => {
            console.log(result);
            if (photoFiles.indexOf(photoFile) === photoFiles.length - 1)
              resolve();

          }, (err) => {
            reject(err);
          });
        }
        );
      });

      if (photoFiles.length === 0)
        resolve();
    });
  }

  checkAfterPhotosExist(photoFiles) {
    return new Promise((resolve, reject) => {

      photoFiles.forEach(photoFile => {
        this.file.checkFile(this.file.externalCacheDirectory, this.providerUtility.getFileName(photoFile.AfterPath)).then((result) => {
          console.log(photoFile.AfterPath);
          if (photoFiles.indexOf(photoFile) === photoFiles.length - 1)
            resolve();

        }, (err) => {
          this.fileTransfer.download(this.config.smartWebsiteUrl + this.config.punchListPath + this.providerUtility.getFileName(photoFile.AfterPath), photoFile.AfterPath).then((result) => {
            console.log(result);
            if (photoFiles.indexOf(photoFile) === photoFiles.length - 1)
              resolve();

          }, (err) => {
            reject(err);
          });
        }
        );
      });

      if (photoFiles.length === 0)
        resolve();
    });
  }

  getPhotoCacheFiles() {
    return new Promise((resolve, reject) => {
      this.file.listDir(this.file.externalCacheDirectory, "").then((files) => {
        this.PhotoCacheList = files;
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  clearPhotoCache(files) {
    return new Promise((resolve, reject) => {
      files.forEach(file => {
        this.file.removeFile(this.file.externalCacheDirectory, file.name).then((result) => {
          if (files.indexOf(file) === files.length - 1)
            resolve();
        }, (err) => {
          reject(err);
        });
      });

      if (files.length === 0)
        resolve();
    });
  }

  getPhotoQualityLimit() {
    return new Promise((resolve, reject) => {
      let command = "getsettings ";

      this.http.get(this.config.queryApiUrl + command)
        .subscribe(res => {
          let data = res.json();
          if (data[0].length > 0) {
            this.PhotoQualityLimit = data[0][0].quality;
            resolve();
          } else {
            reject('Photo quality limit not found.');
          }
        }, (err) => {
          reject(err._body);
        });

    });
  }

}