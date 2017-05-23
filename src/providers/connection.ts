import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import 'rxjs/add/operator/map';

/*
  Generated class for the Connection provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Connection {

  constructor(private network: Network) {
    console.log('Hello Connection Provider');
  }

  isOnline() {
    if (this.network.type !== 'none')
      return true;
    else
      return false;
  }

}