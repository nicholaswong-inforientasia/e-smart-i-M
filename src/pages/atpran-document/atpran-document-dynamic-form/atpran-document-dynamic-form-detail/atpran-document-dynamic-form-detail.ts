import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PageUtility } from '../../../page.utility';
import { ATPRANDocument } from '../../../../providers/atpran-document';
import { PunchList } from '../../../../providers/punch-list';
import { ATPRANDocumentDynamicFormDetailReferencePhoto } from './atpran-document-dynamic-form-detail-reference-photo/atpran-document-dynamic-form-detail-reference-photo';
import { ATPRANDocumentDynamicFormDetailActualPhoto } from './atpran-document-dynamic-form-detail-actual-photo/atpran-document-dynamic-form-detail-actual-photo';
import { PunchListDetailPage } from '../../../../pages/punch-list/punch-list-detail/punch-list-detail';

/*
  Generated class for the ATPRANDocumentDynamicFormDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-atpran-document-dynamic-form-detail',
  templateUrl: 'atpran-document-dynamic-form-detail.html'
})
export class ATPRANDocumentDynamicFormDetailPage {
  documentName;
  metaTable;
  tableItems;
  itemCheckArray = [];
  rsItems = [];
  punchListDetails = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private pageUtility: PageUtility, private atpRANDocument: ATPRANDocument, private punchList: PunchList) {
    this.documentName = navParams.get('documentName');
    this.metaTable = navParams.get('metaTable');
    this.tableItems = navParams.get('tableItems');

    this.metaTable.header.forEach(header => {
      if (header.startsWith('NE')) {
        if (this.metaTable.item[header] !== null)
          this.itemCheckArray = this.metaTable.item[header].split(',');
      }

      if (header.startsWith('RS')) {
        let xmlId = header.split('_')[2];
        this.atpRANDocument.getRSItems(xmlId).then((result) => {
          this.rsItems = this.atpRANDocument.rsItems;
        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }
    });

    this.loadPunchList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ATPRANDocumentDynamicFormDetailPage');
  }

  savePage() {
    this.saveData(1);

    this.metaTable.header.forEach(header => {
      if (header.startsWith('NE')) {
        if (this.metaTable.item[header] !== null)
          if (this.punchListDetails !== undefined) {
            this.punchList.setPunchListDetail(this.punchListDetails).then((result) => {
              // this.pageUtility.showMsg('Success', 'Punch List saved.');

            }, (err) => {
              this.pageUtility.showMsg('Error', err);
            });
          }
      }
    });

    this.pageUtility.showMsg('Success', 'Input saved.');
  }

  saveData(mobile) {
    this.metaTable.header.forEach(header => {
      if (header.startsWith('NE')) {
        if (this.metaTable.item[header] !== null)
          this.metaTable.item[header] = this.itemCheckArray.join(',');
      }
    });

    this.atpRANDocument.setUpdateTransactionData(this.tableItems, mobile).then((result) => {
      this.loadPunchList();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  loadPunchList() {
    this.punchList.getPunchListDetails().then((result) => {
      this.punchListDetails = this.punchList.Details;

      this.itemCheckArray = [];
      let NEList = this.metaTable.item.NELIST.split(',')
      this.punchListDetails.forEach(punchListDetail => {
        NEList.forEach(item => {
          if (item === punchListDetail.OpenIssue) {
            this.itemCheckArray.push(item);
            let cnt = 0;
            this.itemCheckArray.forEach(item2 => {
              if (item === item2)
                cnt = cnt + 1;
              if (cnt > 1)
                this.itemCheckArray.pop();
            });
          }
        });
      });
      console.log(this.itemCheckArray);

      let punchListDetailsTemp = [];
      this.itemCheckArray.forEach(item => {
        this.punchListDetails.forEach(punchListDetail => {
          if (item === punchListDetail.OpenIssue)
            punchListDetailsTemp.push(punchListDetail);
        });
      });
      this.punchListDetails = punchListDetailsTemp;
      console.log(this.punchListDetails);
      this.pageUtility.loading.dismiss();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

  }

  itemCheckOnChange() {
    this.metaTable.header.forEach(header => {
      if (header.startsWith('RS')) {
        if (this.itemCheckArray.length === 0)
          this.metaTable.item[header] = this.getRSValue('PASS');
        else
          this.metaTable.item[header] = this.getRSValue('FAIL');
      }
    });

    this.saveData(0);
  }

  disableRSItem(text) {
    let retval;
    let NEFound;

    this.metaTable.header.forEach(header => {
      if (header.startsWith('NE'))
        NEFound = true;
    });

    if (!NEFound)
      retval = false;
    else
      if (text === 'PASS' || text === 'FAIL')
        retval = true;

    return retval;
  }

  getRSValue(text) {
    if (text === 'PASS')
      return '133';
    if (text === 'FAIL')
      return '153';
  }

  showReferencePhotos() {
    this.pageUtility.navCtrl.push(ATPRANDocumentDynamicFormDetailReferencePhoto, {
      metaTable: this.metaTable
    });
  }

  showActualPhotos() {
    this.pageUtility.navCtrl.push(ATPRANDocumentDynamicFormDetailActualPhoto, {
      metaTable: this.metaTable
    });
  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(PunchListDetailPage, {
      item: item
    }).then((result) => {

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  getItemCheckDesc(item) {
    this.punchList.getItemCheckDesc(item).then((result) => {
      return result;

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}