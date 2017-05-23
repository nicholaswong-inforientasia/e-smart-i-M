import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Location } from '../../../../providers/location';
import { PunchList } from '../../../../providers/punch-list';
import { PageUtility } from '../../../page.utility';
import { FileTransfer } from '../../../../providers/file-transfer';
import { ProviderUtility } from '../../../../providers/provider.utility';
import { Config } from '../../../../providers/config';

/*
  Generated class for the PunchListDetailPhotoAfter page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-punch-list-detail-photo-after',
  templateUrl: 'punch-list-detail-photo-after.html'
})
export class PunchListDetailPhotoAfterPage {

  pictures;
  rowNo;
  afterCaption: '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private location: Location, private punchList: PunchList, private pageUtility: PageUtility, private fileTransfer: FileTransfer, private providerUtility: ProviderUtility, private file: File, private config: Config, private camera: Camera) {
    this.rowNo = navParams.get('rowNo');

  }

  ionViewDidLoad() {
    this.getPictures();
    console.log('ionViewDidLoad PunchListDetailPhotoAfterPage');
  }


  getPictures() {
    this.punchList.getAfterPhotoList(this.rowNo).then((result) => {
      this.pictures = this.punchList.PhotoList

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  getPicture() {

    this.punchList.getPhotoQualityLimit().then((res) => {

      const options: CameraOptions = {
        quality: this.punchList.PhotoQualityLimit
      }

      this.camera.getPicture(options).then((imageData) => {

        this.location.getCurrentLocation().then((res) => {
          console.log('Long: ' + this.location.Longitude + ' Lat: ' + this.location.Latitude);

          if (this.afterCaption === undefined) this.afterCaption = "";
          let picture = {
            RowNo: this.rowNo,
            AfterCaption: this.afterCaption,
            AfterPath: imageData,
            ALat: this.location.Latitude,
            ALong: this.location.Longitude
          };

          if (this.pictures === undefined)
            this.pictures = [];

          this.fileTransfer.upload('punchListPhoto', imageData).then((result) => {
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
    }, (err) => {
      console.log(err);
    });
  }

  setPicture(picture) {
    this.punchList.setAfterPhoto(picture).then((result) => {
      this.getPictures();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  deleteItem(item) {
    this.punchList.delPhoto(item.Sno).then((result) => {
      this.getPictures();

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  updateItem(item) {
    this.punchList.updAfterPhoto(item).then((result) => {
      this.pageUtility.showMsg('Success', 'Caption updated.')

    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

}
