import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../page.utility';
import { BOMActual } from '../../../../providers/bom-actual';
import { BOMActualConfigAddDetailPage } from './bom-actual-config-add-detail/bom-actual-config-add-detail';

/*
  Generated class for the BOMActualConfigAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-config-add',
  templateUrl: 'bom-actual-config-add.html'
})
export class BOMActualConfigAddPage {

  networkElement;
  actualConfigSearchInitList;
  actualConfigSearchList;

  constructor(navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    // this.pageUtility.showLoader('Loading New Config...');

    this.networkElement = navParams.get('NetworkElement');

    this.bomActual.getBOMActualConfigSearchList(this.networkElement).then((result) => {
      this.actualConfigSearchInitList = this.bomActual.ActualConfigSearchList;
      this.actualConfigSearchList = this.actualConfigSearchInitList;

      // this.pageUtility.loading.dismiss();
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualConfigAddPage');
  }

  getItems(ev) {
    // Reset items back to all of the items    

    // set val to the value of the ev target
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.actualConfigSearchList = this.actualConfigSearchInitList.filter((actualConfigSearch) => {
        return (actualConfigSearch.level2desc.toLowerCase().indexOf(val.toLowerCase()) > -1 || actualConfigSearch.pono.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.actualConfigSearchList = this.actualConfigSearchInitList;
    }
  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualConfigAddDetailPage, {
      ActualConfigSearch: item
    });
  }

}
