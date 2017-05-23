import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { PageUtility } from '../../page.utility';
import { PunchList } from '../../../providers/punch-list';
import { ProviderUtility } from '../../../providers/provider.utility';
import { FileTransfer } from '../../../providers/file-transfer';
import { Config } from '../../../providers/config';
import { PunchListDetailPhotoBeforePage } from './punch-list-detail-photo-before/punch-list-detail-photo-before';
import { PunchListDetailPhotoAfterPage } from './punch-list-detail-photo-after/punch-list-detail-photo-after';

/*
  Generated class for the PunchListDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-punch-list-detail',
  templateUrl: 'punch-list-detail.html'
})
export class PunchListDetailPage {

  punchListDetail;
  overwriteCanLeave;
  beforeButtonClick;
  afterButtonClick;

  constructor(private navParams: NavParams, private pageUtility: PageUtility, private punchList: PunchList, private providerUtility: ProviderUtility, private fileTransfer: FileTransfer, private file: File, private config: Config) {
    this.punchListDetail = navParams.get('item')
    if (this.punchListDetail !== undefined) {
      this.punchListDetail.Targetclosedate = this.providerUtility.convertDate(this.punchListDetail.Targetclosedate);
      this.punchListDetail.Issueclosedate = this.providerUtility.convertDate(this.punchListDetail.Issueclosedate);
    }
    else
    { }
    this.itemCheckOnChange();

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter PunchListDetailPage');
    this.overwriteCanLeave = false;
    this.checkCanLeave();
    if (this.punchList.BeforePhotoAdded || this.punchList.AfterPhotoAdded)
      this.overwriteCanLeave = true;
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave PunchListDetailPage');
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PunchListDetailPage');
  }

  ionViewWillUnload() {
    console.log('ionViewWillUnload PunchListDetailPage');

  }

  ionViewCanLeave(): boolean {
    console.log('ionViewCanLeave PunchListDetailPage');
    // here we can either return true or false
    // depending on if we want to leave this view    
    return this.checkCanLeave();
  }


  checkCanLeave() {
    let canLeave = false;
    if (this.punchListDetail.Targetclosedate !== "") {
      this.punchList.getBeforePhotoList(this.punchListDetail.Rowno).then((result) => {
        if (this.punchList.PhotoList.length > 0 || this.overwriteCanLeave) {
          if (this.punchListDetail.Issueclosedate !== "") {
            this.punchList.getAfterPhotoList(this.punchListDetail.Rowno).then((result) => {
              if (this.punchList.PhotoList.length > 0 || this.overwriteCanLeave) {
                canLeave = true;
                this.overwriteCanLeave = true;
                return canLeave;
              }
              else {
                if (!this.overwriteCanLeave) {
                  this.pageUtility.showMsg('Error', 'No After Photos found. Please take After Photo.');
                  canLeave = false;
                  return canLeave;
                }
              }
            }, (err) => {
              if (!this.overwriteCanLeave) {
                this.pageUtility.showMsg('Error', err);
                canLeave = false;
                return canLeave;
              }
            });
          }
          else {
            canLeave = true;
            this.overwriteCanLeave = true;
            return canLeave;
          }
        }
        else {
          if (!this.overwriteCanLeave) {
            this.pageUtility.showMsg('Error', 'No Before Photos found. Please take Before Photo.');
            canLeave = false;
            return canLeave;
          }
        }
      }, (err) => {
        if (!this.overwriteCanLeave) {
          this.pageUtility.showMsg('Error', err);
          canLeave = false;
          return canLeave;
        }
      });
    } else {
      if (!this.overwriteCanLeave) {
        this.pageUtility.showMsg('Error', 'Please enter the Target Close Date.');
        canLeave = false;
        return canLeave;
      }
    }

    if (this.overwriteCanLeave)
      canLeave = true;

    return canLeave;

  }

  itemCheckOnChange() {
    if (this.punchListDetail !== undefined) {
      if (this.punchListDetail.NEOpenIssue !== "") {
        this.punchList.getItemCheckList(this.punchListDetail.NEOpenIssue).then((result) => {
          console.log(this.punchListDetail.NEOpenIssue);

        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }
    }
  }

  openPhotoPage(page) {
    this.overwriteCanLeave = true;

    if (page === 'Before') {

      this.punchList.getBeforePhotoList(this.punchListDetail.Rowno).then((result) => {
        this.punchList.checkBeforePhotosExist(this.punchList.PhotoList).then((result) => {
          if (this.punchListDetail.sc !== '') {
            this.pageUtility.navCtrl.push(PunchListDetailPhotoBeforePage, {
              rowNo: this.punchListDetail.Rowno
            });
          }
        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });

      if (this.punchListDetail.sc === '') {
        this.pageUtility.navCtrl.push(PunchListDetailPhotoBeforePage, {
          rowNo: this.punchListDetail.Rowno
        });
      }
    }
    else {
      this.punchList.getAfterPhotoList(this.punchListDetail.Rowno).then((result) => {
        this.punchList.checkAfterPhotosExist(this.punchList.PhotoList).then((result) => {
          if (this.punchListDetail.sc !== '') {
            this.pageUtility.navCtrl.push(PunchListDetailPhotoAfterPage, {
              rowNo: this.punchListDetail.Rowno
            });
          }
        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });

      if (this.punchListDetail.sc === '') {
        this.pageUtility.navCtrl.push(PunchListDetailPhotoAfterPage, {
          rowNo: this.punchListDetail.Rowno
        });
      }
    }
  }



}