import { Component } from '@angular/core';
import { BOMActualConfigPage } from './bom-actual-config/bom-actual-config';
import { BOMActualExtraMaterialAddPage } from './bom-actual-extra-material-add/bom-actual-extra-material-add';
import { BOMActualExtraMaterialDetailPage } from './bom-actual-extra-material-detail/bom-actual-extra-material-detail';
import { BOMActual } from '../../providers/bom-actual';
import { PageUtility } from '../page.utility';


/*
  Generated class for the BOMActual page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual',
  templateUrl: 'bom-actual.html'
})
export class BOMActualPage {

  constructor(private pageUtility: PageUtility, private bomActual: BOMActual) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualPage');

    // this.pageUtility.showLoader('Loading BOM Actual...');

    this.bomActual.getNetworkElementList().then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    this.bomActual.getBOMActualExtraMaterialList().then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    // if (this.pageUtility.loading !== undefined)
    //   this.pageUtility.loading.dismiss();
  }

  selectNetworkElementItem(item) {
    this.pageUtility.navCtrl.push(BOMActualConfigPage, {
      NetworkElement: item
    });
  }

  selectExtraMaterialItem(item) {
    this.pageUtility.navCtrl.push(BOMActualExtraMaterialDetailPage, {
      ExtraMaterial: item
    });
  }

  deleteItem(item) {
    this.bomActual.delBOMActualExtraMaterial(item.sno).then((result) => {
      this.bomActual.getBOMActualExtraMaterialList().then((result) => {

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }


  searchExtraMaterial() {
    this.pageUtility.navCtrl.push(BOMActualExtraMaterialAddPage, {

    });
  }

  getColor(serialno) {
    if (serialno === "Add")
      return "primary";
    else
      return "secondary";
  }

}
