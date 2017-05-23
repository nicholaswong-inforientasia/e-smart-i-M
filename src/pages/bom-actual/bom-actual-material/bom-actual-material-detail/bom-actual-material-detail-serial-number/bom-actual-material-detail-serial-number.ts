import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../../../page.utility';
import { BOMActual } from '../../../../../providers/bom-actual';
import { Barcode } from '../../../../../providers/barcode';

/*
  Generated class for the BOMActualMaterialDetailSerialNumber page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-material-detail-serial-number',
  templateUrl: 'bom-actual-material-detail-serial-number.html'
})
export class BOMActualMaterialDetailSerialNumberPage {
  materialDetail;
  mcId;
  sbId;
  newQty;
  serialNumber;
  materialSerialNumberList: any[];

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private bomActual: BOMActual, private barcode: Barcode) {
    this.materialDetail = navParams.get('Material')
    this.mcId = this.materialDetail.mcid;
    this.sbId = navParams.get('SBId');
    this.newQty = this.materialDetail.newqty;
    this.serialNumber = this.materialDetail.serialnumber;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualMaterialDetailSerialNumberPage');

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
      this.bomActual.getBOMActualMaterialSerialNumberList(this.mcId, this.sbId).then((result) => {
        this.materialSerialNumberList = this.bomActual.MaterialSerialNumberList;

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }

    // this.pageUtility.loading.dismiss();

  }

  saveBOMActualMaterialDetailSerialNumber() {
    this.bomActual.setBOMActualMaterialDetailSerialNumber(this.materialDetail, this.materialSerialNumberList, this.mcId, this.sbId).then((result) => {
      console.log(this.materialSerialNumberList);
      this.pageUtility.showMsg('Success', 'Material Serial Number saved.');

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  barcodeScan(serialNumber) {
    this.barcode.scan().then((result) => {
      console.log(this.barcode.Barcode);
      serialNumber.serialnumber = this.barcode.Barcode;

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });


  }

}