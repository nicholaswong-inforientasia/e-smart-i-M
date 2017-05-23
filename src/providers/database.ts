import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Config } from './config';
import { Connection } from './connection';
import 'rxjs/add/operator/map';

/*
  Generated class for the Database provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Database {

  db: SQLiteObject;

  constructor(private http: Http, private config: Config, private sqlite: SQLite, private connection: Connection) {
    console.log('Hello Database Provider');
    
  }

  createDB() {
    return new Promise((resolve, reject) => {
      this.sqlite.create({ name: 'data.db', location: 'default', }).then((res) => {
        this.db = res;
        console.log('sqlite.create: ' + this.db)
        resolve(this.db);
      }, (err) => {
        console.log('sqlite.create: ' + err)
        reject(err);
      });
    });
  }

  initSqliteDB() {
    this.sqliteQuery('CREATE TABLE IF NOT EXISTS mobilesettings (geofencelimit INTEGER, quality INTEGER, appversion TEXT)').then((res) => {
      this.sqliteQuery('DELETE FROM mobilesettings').then((res) => {
        this.sqliteQuery("INSERT INTO mobilesettings VALUES (500,50,'1.0.6')").then((res) => {
          this.sqliteQuery('CREATE VIEW IF NOT EXISTS getsettings AS SELECT geofencelimit, quality, appversion FROM mobilesettings').then((res) => {

          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });
  }
dfgfdgdfgfd
  sqliteQuery(sqlStmt) {
    return new Promise((resolve, reject) => {

      if (this.db === undefined) {
        this.createDB().then((res) => {
          this.db.executeSql(sqlStmt, []).then((res) => {
            console.log('db.executeSql: ' + res)
            resolve(res);

          }, (err) => {
            reject('db.executeSql: ' + err);
          });
        }, (err) => {
          reject(err);
        });

      } else {
        this.db.executeSql(sqlStmt, []).then((res) => {
          console.log('db.executeSql: ' + res)
          resolve(res);

        }, (err) => {
          reject('db.executeSql: ' + err);
        });

      }
    });
  }

  query(onlineCommand, offlineCommand) {
    return new Promise((resolve, reject) => {
      if (this.connection.isOnline()) {
        this.http.get(this.config.queryApiUrl + onlineCommand)
          .subscribe(res => {
            let data = res.json();
            resolve(data);
          }, (err) => {
            reject(err._body);
          });
      } else {
        this.sqliteQuery(offlineCommand)
          .then((data) => {
            console.log('sqliteQuery: ' + data)
            resolve(data);
          })
          .catch((err) => {
            console.log('sqliteQuery catch: ' + err)
            reject(err);
          });
      }
    });

  }

}