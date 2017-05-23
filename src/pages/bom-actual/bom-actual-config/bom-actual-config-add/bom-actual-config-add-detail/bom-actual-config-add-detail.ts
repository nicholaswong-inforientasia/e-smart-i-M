import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../../page.utility';
import { BOMActual } from '../../../../../providers/bom-actual';
/*
  Generated class for the BOMActualConfigAddDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-config-add-detail',
  templateUrl: 'bom-actual-config-add-detail.html'
})
export class BOMActualConfigAddDetailPage {

  actualConfigSearch;
  qty;
  neId;
  l2SNo;
  poNo;
  networkElement;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual) {
    this.actualConfigSearch = navParams.get('ActualConfigSearch');
    this.neId = this.actualConfigSearch.neid;
    this.l2SNo = this.actualConfigSearch.l2sno;
    this.poNo = this.actualConfigSearch.pono;
    this.networkElement = this.actualConfigSearch.element;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualConfigAddDetailPage');
  }

  saveBOMActualConfigDetail() {
    this.bomActual.setBOMActualConfigAddDetail(this.neId, this.l2SNo, this.poNo, this.qty).then((result) => {
      this.pageUtility.showMsg('Success', 'Actual Config added.');

      this.bomActual.getLevel2ConfigList(this.networkElement).then((result) => {

        this.bomActual.getBOMActualConfigListNew(this.networkElement).then((result) => {

        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        })

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }


}
