import { Component } from '@angular/core';
import { PunchList } from '../../providers/punch-list';
import { Authentication } from '../../providers/authentication';
import { PageUtility } from '../page.utility';
import { PunchListDetailPage } from './punch-list-detail/punch-list-detail';
// import { LocationValidationPage } from '../location-validation/location-validation';

/*
  Generated class for the PunchList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-punch-list',
    templateUrl: 'punch-list.html'
})
export class PunchListPage {

    startDate;
    endDate;
    testDescription;
    visibility;
    FCPS;
    networkElement

    itemCheck;
    itemCheckList;
    majorOrMinor;
    targetCloseDate;
    issueCloseDate;

    punchListDetails: any = [];

    constructor(private pageUtility: PageUtility, private punchList: PunchList, private authentication: Authentication) {

    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter PunchListPage');

    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad PunchListPage');
        this.pageUtility.showLoader('Loading Punch List...')

        this.punchList.getPunchListHeader().then((result) => {
            this.startDate = this.punchList.Header.StartDate;
            this.endDate = this.punchList.Header.EndDate;
            this.testDescription = this.punchList.Header.TestDescription;
            this.visibility = this.punchList.Header.Visibility;
            this.FCPS = this.punchList.Header.FCPS;

        }, (err) => {
            this.pageUtility.showMsg('Error', err);
        });

        this.punchList.getPunchListDetails().then((result) => {
            this.punchListDetails = this.punchList.Details;
            this.pageUtility.loading.dismiss();

        }, (err) => {
            this.pageUtility.showMsg('Error', err);
        });
    }

    itemCheckOnChange() {

        this.punchList.getItemCheckList(this.networkElement).then((result) => {
            this.itemCheckList = this.punchList.ItemCheckList;

        }, (err) => {
            this.pageUtility.showMsg('Error', err);
        });
    }

    savePunchList() {
        this.punchList.setPunchListHeader().then((result) => {
            this.pageUtility.showMsg('Success', 'Punch List saved.');

        }, (err) => {
            this.pageUtility.showMsg('Error', err);
        });

        if (this.punchListDetails !== undefined) {
            this.punchList.setPunchListDetail(this.punchListDetails).then((result) => {
                // this.pageUtility.showMsg('Success', 'Punch List saved.');

            }, (err) => {
                this.pageUtility.showMsg('Error', err);
            });
        }
    }

    newPunchList() {
        let item = {
            Rowno: '',
            sc: '',
            NEOpenIssue: '',
            OpenIssue: '',
            Majororminor: '',
            Targetclosedate: '',
            Issueclosedate: ''
        }

        if (this.punchListDetails === undefined)
            this.punchListDetails = [];

        this.punchListDetails.push(item);
        let index = this.punchListDetails.indexOf(item);
        item.Rowno = index + 1;

        this.pageUtility.navCtrl.push(PunchListDetailPage, {
            item: item
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

    removeItem(item) {
        let index = this.punchListDetails.indexOf(item);

        if (index > -1) {
            this.punchListDetails.splice(index, 1);
        }
    }

    logout() {


    }
}