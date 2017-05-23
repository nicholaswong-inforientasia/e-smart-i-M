import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../page.utility';
import { BOMActual } from '../../../providers/bom-actual';
import { BOMActualMaterialDetailPage } from '../bom-actual-material/bom-actual-material-detail/bom-actual-material-detail';

/*
  Generated class for the BOMActualMaterial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-material',
  templateUrl: 'bom-actual-material.html'
})
export class BOMActualMaterialPage {

  config;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    this.config = navParams.get('Config');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualMaterialPage');

    // this.pageUtility.showLoader('Loading Material...');

    this.bomActual.getBOMActualMaterialList(this.config.NEDesc, this.config.L2sno, this.config.SBID).then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    // this.pageUtility.loading.dismiss();
  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualMaterialDetailPage, {
      Material: item,
      ActualConfig: this.config
    });
  }

}
