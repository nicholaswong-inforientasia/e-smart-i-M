import { Component } from '@angular/core';
import { ATPRANDocument } from '../../providers/atpran-document';
import { PageUtility } from '../page.utility';
import { ATPRANDocumentDynamicFormPage } from './atpran-document-dynamic-form/atpran-document-dynamic-form';

/*
  Generated class for the ATPRANDocument page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-atpran-document',
  templateUrl: 'atpran-document.html'
})
export class ATPRANDocumentPage {
  documentId;
  networkElementId;
  exhibitId;

  constructor(private pageUtility: PageUtility, private atpRANDocument: ATPRANDocument) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ATPRANDocumentPage');

    this.pageUtility.showLoader('Loading ATP RAN Document...');

    this.atpRANDocument.getDocumentList().then((result) => {

      this.atpRANDocument.getNetworkElementList().then((result) => {

        this.pageUtility.loading.dismiss();
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

  }

  viewPage() {
    if (this.documentId === undefined || this.networkElementId === undefined || this.exhibitId === undefined) {
      this.pageUtility.showMsg('Error', "Please select Document, Network Element and Exhibit.");
    } else {
      this.pageUtility.navCtrl.push(ATPRANDocumentDynamicFormPage, {
        documentId: this.documentId,
        networkElementId: this.networkElementId,
        exhibitId: this.exhibitId
      });
    }
  }

  networkElementIdOnChange() {
    this.atpRANDocument.getExhibitList(this.networkElementId).then((result) => {
      console.log(this.atpRANDocument.exhibitList);
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}