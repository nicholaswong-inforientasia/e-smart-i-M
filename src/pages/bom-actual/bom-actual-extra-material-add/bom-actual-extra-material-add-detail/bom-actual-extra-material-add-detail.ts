import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../page.utility';
import { BOMActual } from '../../../../providers/bom-actual';

/*
  Generated class for the BOMActualExtraMaterialAddDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-extra-material-add-detail',
  templateUrl: 'bom-actual-extra-material-add-detail.html'
})
export class BOMActualExtraMaterialAddDetailPage {
  materialDetail;
  networkElement;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    this.materialDetail = navParams.get('Material')
    this.networkElement = this.materialDetail.Element;

    // this.pageUtility.showLoader('Loading Extra Material...');

    this.bomActual.getExtraMaterialNetworkElementList().then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    })

    // this.pageUtility.loading.dismiss();



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualExtraMaterialAddDetailPage');
  }


  saveBOMActualExtraMaterial() {

    this.bomActual.getBOMActualExtraMaterialAdd(this.materialDetail.materialid, this.networkElement).then((result) => {

      this.bomActual.setBOMActualExtraMaterialDetail(this.bomActual.ExtraMaterialAdd, this.networkElement).then((result) => {

        this.pageUtility.showMsg('Success', 'Extra Material added.');

        this.bomActual.getBOMActualExtraMaterialList().then((result) => {

        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      })

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });




  }
}
