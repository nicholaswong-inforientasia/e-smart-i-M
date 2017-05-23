import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../page.utility';
import { BOMActual } from '../../../../providers/bom-actual';
import { Barcode } from '../../../../providers/barcode';

/*
  Generated class for the BOMActualExtraMaterialDetailSerialNumber page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-extra-material-detail-serial-number',
  templateUrl: 'bom-actual-extra-material-detail-serial-number.html'
})
export class BOMActualExtraMaterialDetailSerialNumberPage {

  materialDetail;
  mcId;
  newQty;
  serialNumber;
  materialSerialNumberList: any[];

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual, private barcode: Barcode) {
    this.materialDetail = navParams.get('Material')
    this.mcId = this.materialDetail.mcid;
    this.newQty = this.materialDetail.newqty;
    this.serialNumber = this.materialDetail.serialno[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualExtraMaterialDetailSerialNumberPage');

    // this.pageUtility.showLoader('Loading Material Serial Number...');

    if (this.newQty > 0 && this.serialNumber === 'Add') {

      if (this.materialSerialNumberList === undefined)
        this.materialSerialNumberList = [];
      while (this.materialSerialNumberList.length < this.newQty) {
        let item = {
          rowno: 0,
          serialnumber: '',
          remarks: ''
        }

        item.rowno = this.materialSerialNumberList.length + 1;
        this.materialSerialNumberList.push(item);
      }
    } else {
      this.bomActual.getBOMActualExtraMaterialSerialNumberList(this.mcId).then((result) => {
        this.materialSerialNumberList = this.bomActual.MaterialSerialNumberList;

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }

    // this.pageUtility.loading.dismiss();
  }

  barcodeScan(serialNumber) {
    this.barcode.scan().then((result) => {
      console.log(this.barcode.Barcode);
      serialNumber.serialnumber = this.barcode.Barcode;

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });


  }

  saveBOMActualExtraMaterialDetailSerialNumber() {
    this.bomActual.setBOMActualExtraMaterialDetailSerialNumber(this.materialDetail, this.materialSerialNumberList, this.mcId).then((result) => {
      console.log(this.materialSerialNumberList);
      this.pageUtility.showMsg('Success', 'Extra Material Serial Number saved.');

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}
