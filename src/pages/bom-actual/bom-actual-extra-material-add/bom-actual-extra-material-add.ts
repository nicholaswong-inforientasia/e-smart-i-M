import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../page.utility';
import { BOMActual } from '../../../providers/bom-actual';
import { BOMActualExtraMaterialAddDetailPage } from './bom-actual-extra-material-add-detail/bom-actual-extra-material-add-detail';

/*
  Generated class for the BOMActualExtraMaterialAdd page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-extra-material-add',
  templateUrl: 'bom-actual-extra-material-add.html'
})
export class BOMActualExtraMaterialAddPage {

  networkElement;
  extraMaterialSearchInitList;
  extraMaterialSearchList;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    // this.pageUtility.showLoader('Loading Extra Material...');

    this.bomActual.getExtraMaterialNetworkElementList().then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    })

    // this.pageUtility.loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualExtraMaterialAddPage');
  }

  itemCheckOnChange() {
    // this.pageUtility.showLoader('Loading Extra Material...');

    this.bomActual.getBOMActualExtraMaterialSearchList(this.networkElement).then((result) => {
      this.extraMaterialSearchInitList = this.bomActual.ExtraMaterialSearchList;
      this.extraMaterialSearchList = this.extraMaterialSearchInitList;

      // this.pageUtility.loading.dismiss();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    })


  }

  getItems(ev) {
    // Reset items back to all of the items    

    // set val to the value of the ev target
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.extraMaterialSearchList = this.extraMaterialSearchInitList.filter((extraMaterialSearch) => {
        return (extraMaterialSearch.materialid.toLowerCase().indexOf(val.toLowerCase()) > -1 || extraMaterialSearch.mname.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.extraMaterialSearchList = this.extraMaterialSearchInitList;
    }
  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualExtraMaterialAddDetailPage, {
      Material: item
    });
  }


}
