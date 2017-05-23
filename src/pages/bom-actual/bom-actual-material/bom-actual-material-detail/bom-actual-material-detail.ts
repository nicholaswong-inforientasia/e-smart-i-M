import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../page.utility';
import { BOMActual } from '../../../../providers/bom-actual';
import { BOMActualMaterialDetailSerialNumberPage } from './bom-actual-material-detail-serial-number/bom-actual-material-detail-serial-number';

/*
  Generated class for the BOMActualMaterialDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-material-detail',
  templateUrl: 'bom-actual-material-detail.html'
})
export class BOMActualMaterialDetailPage {

  materialDetail;
  actualConfig;
  sbId;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    this.materialDetail = navParams.get('Material');
    this.actualConfig = navParams.get('ActualConfig').L2sno;
    this.sbId = navParams.get('ActualConfig').SBID;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualMaterialDetailPage');

  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualMaterialDetailSerialNumberPage, {
      Material: item,
      SBId: this.sbId
    });
  }

  saveBOMActualMaterialDetail() {
    this.bomActual.setBOMActualMaterialDetail(this.materialDetail.mcid, this.materialDetail.planqty, this.materialDetail.reusedqty, this.materialDetail.newqty,
      this.materialDetail.remarks, this.actualConfig, this.sbId).then((result) => {
        this.pageUtility.showMsg('Success', 'Material Detail saved.');

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
  }


}
