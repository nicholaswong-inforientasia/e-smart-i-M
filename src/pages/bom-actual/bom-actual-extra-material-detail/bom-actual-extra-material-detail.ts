import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../page.utility';
import { BOMActual } from '../../../providers/bom-actual';
import { BOMActualExtraMaterialDetailSerialNumberPage } from './bom-actual-extra-material-detail-serial-number/bom-actual-extra-material-detail-serial-number';

/*
  Generated class for the BOMActualExtraMaterialDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-extra-material-detail',
  templateUrl: 'bom-actual-extra-material-detail.html'
})
export class BOMActualExtraMaterialDetailPage {

  extraMaterialDetail;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    this.extraMaterialDetail = navParams.get('ExtraMaterial');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualExtraMaterialDetailPage');
  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualExtraMaterialDetailSerialNumberPage, {
      Material: item
    });
  }

  saveBOMActualExtraMaterialDetail() {
    this.bomActual.setBOMActualExtraMaterialDetail(this.extraMaterialDetail, 0).then((result) => {
      this.pageUtility.showMsg('Success', 'Extra Material saved.');

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    })
  }



}
