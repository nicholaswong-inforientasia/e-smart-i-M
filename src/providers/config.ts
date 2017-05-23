import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppVersion } from '@ionic-native/app-version';
import { Database } from './database';

@Injectable()
export class Config {
    private smartApiUrl = 'https://e-smart-i.smartfren.com:81/smartapi/';//https://e-smart-i.smartfren.com:81/smartapi/
    queryApiUrl = this.smartApiUrl + 'query/';
    uploadApiUrl = this.smartApiUrl + 'upload/';
    punchListPath = 'PLPhotos/';
    metaXmlPath = 'metaxml/'
    smartWebsiteUrl = 'http://e-smart-i.smartfren.com/demo/';

    PhotoQualityLimit;

    constructor(private http: Http, private database: Database, private appVersion: AppVersion) {
        console.log('Hello Config Provider');
    }

    getPhotoQualityLimit() {
        return new Promise((resolve, reject) => {
            let command = "getsettings ";

            this.http.get(this.queryApiUrl + command)
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

    validateAppVersion() {
        return new Promise((resolve, reject) => {
            let onlineCommand = "getsettings ";
            let offlineCommand = "SELECT * FROM getsettings ";

            this.database.query(onlineCommand, offlineCommand).then((data) => {
                if (data[0].length > 0) {
                    let LatestAppVersion = data[0][0].appversion;

                    this.appVersion.getVersionCode().then((versionCode) => {
                        let VersionCode = versionCode;
                        this.appVersion.getVersionNumber().then((versionNumber) => {
                            let VersionNumber = versionNumber;

                            let CurrentAppVersion = VersionNumber;
                            if (CurrentAppVersion !== LatestAppVersion)
                                reject("Current app version: " + CurrentAppVersion + " is outdated. Latest app version: " + LatestAppVersion + ". Auto update will start now.");

                        });
                    });
                } else {
                    reject('Geo fence limit not found.');
                }
                resolve();
            }, (err) => {
                reject(err.msg);
            });
        });
    }
}