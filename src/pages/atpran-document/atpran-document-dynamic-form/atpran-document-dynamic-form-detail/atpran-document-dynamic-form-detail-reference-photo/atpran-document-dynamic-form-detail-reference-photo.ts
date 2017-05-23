import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ATPRANDocument } from '../../../../../providers/atpran-document';
import { PageUtility } from '../../../../../pages/page.utility'

/**
 * Generated class for the ATPRANDocumentDynamicFormDetailReferencePhoto page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-atpran-document-dynamic-form-detail-reference-photo',
  templateUrl: 'atpran-document-dynamic-form-detail-reference-photo.html',
})
export class ATPRANDocumentDynamicFormDetailReferencePhoto {

  metaTable;
  referencePhotos = [];
  noReferencePhotosText;

  constructor(public navCtrl: NavController, public navParams: NavParams, private atpRANDocument: ATPRANDocument, private pageUtility: PageUtility) {
    this.metaTable = navParams.get('metaTable');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ATPRANDocumentDynamicFormDetailReferencePhoto');
    this.getPictures();
  }

  getPictures() {
    this.atpRANDocument.getReferencePhotos(this.metaTable.tableId, this.metaTable.item.metatablesno).then((result) => {
      this.referencePhotos = this.atpRANDocument.referencePhotos;
      console.log(this.referencePhotos);
      if (this.referencePhotos.length === 0)
        this.noReferencePhotosText = 'No reference photos.';
      else
        this.noReferencePhotosText = '';

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }


}
