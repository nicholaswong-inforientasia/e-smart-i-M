import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Config } from '../../../../../providers/config';
import { FileTransfer } from '../../../../../providers/file-transfer';
import { ATPRANDocument } from '../../../../../providers/atpran-document';
import { PageUtility } from '../../../../../pages/page.utility'

/**
 * Generated class for the ATPRANDocumentDynamicFormDetailActualPhoto page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-atpran-document-dynamic-form-detail-actual-photo',
  templateUrl: 'atpran-document-dynamic-form-detail-actual-photo.html',
})
export class ATPRANDocumentDynamicFormDetailActualPhoto {
  metaTable;
  actualPhotos = [];
  noActualPhotosText;
  actualCaption;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private config: Config, private fileTransfer: FileTransfer, private atpRANDocument: ATPRANDocument, private pageUtility: PageUtility) {
    this.metaTable = navParams.get('metaTable');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ATPRANDocumentDynamicFormDetailActualPhoto');
    this.getPictures();
  }

  getPictures() {
    this.atpRANDocument.getActualPhotos(this.metaTable.tableId, this.metaTable.item.metatablesno).then((result) => {
      this.actualPhotos = this.atpRANDocument.actualPhotos;
      console.log(this.actualPhotos);
      if (this.actualPhotos.length === 0)
        this.noActualPhotosText = 'No actual photos.';
      else
        this.noActualPhotosText = '';

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  getPicture() {

    this.config.getPhotoQualityLimit().then((res) => {

      const options: CameraOptions = {
        quality: this.config.PhotoQualityLimit
      }

      this.camera.getPicture(options).then((imageData) => {

        if (this.actualCaption === undefined) this.actualCaption = "";
        let picture = {
          tableId: this.metaTable.tableId,
          metatablesno: this.metaTable.item.metatablesno,
          photoattr: this.actualCaption,
          photopath: imageData
        };

        this.fileTransfer.upload('actualPhoto', imageData).then((result) => {
          console.log(imageData);
          this.setPicture(picture);
          this.pageUtility.showMsg('Success', 'Photo uploaded.')

        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        console.log(err);
      });
    }, (err) => {
      console.log(err);
    });

  }

  setPicture(picture) {
    this.atpRANDocument.setActualPhoto(picture).then((result) => {
      this.getPictures();
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  deleteItem(item) {
    this.atpRANDocument.delActualPhoto(item.sno).then((result) => {
      this.getPictures();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  updateItem(item) {
    this.atpRANDocument.updActualPhoto(item).then((result) => {
      this.pageUtility.showMsg('Success', 'Caption updated.')

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}
