import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../page.utility';
import { ATPRANDocument } from '../../../providers/atpran-document';
import { ATPRANDocumentDynamicFormDetailPage } from './atpran-document-dynamic-form-detail/atpran-document-dynamic-form-detail';

/*
  Generated class for the ATPRANDocumentDynamicForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-atpran-document-dynamic-form',
    templateUrl: 'atpran-document-dynamic-form.html'
})
export class ATPRANDocumentDynamicFormPage {

    documentId;
    documentName;
    networkElementId;
    exhibitId;
    metaDocList;
    itemList = [];

    constructor(private navParams: NavParams, private pageUtility: PageUtility, private atpRANDocument: ATPRANDocument) {
        this.documentId = navParams.get('documentId');
        this.networkElementId = navParams.get('networkElementId');
        this.exhibitId = navParams.get('exhibitId');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ATPRANDocumentDynamicFormPage');

        this.atpRANDocument.getMetaDocList(this.documentId, this.networkElementId, this.exhibitId).then((result) => {
            this.documentName = this.atpRANDocument.documentName;
            this.pageUtility.showLoader('Loading ' + this.documentName + '...');

            this.metaDocList = this.atpRANDocument.metaDocList;

            this.getMetaDoc().then((result) => {
                this.itemList = this.itemList.sort(function (a, b) {
                    return a.sequence - b.sequence || a.item.metatablesno - b.item.metatablesno;
                });
                console.log(this.itemList);
                this.pageUtility.loading.dismiss();

            }, (err) => {
                this.pageUtility.showMsg('Error', err);
            });
        }, (err) => {
            this.pageUtility.showMsg('Error', err);
        });
    }


    getMetaDoc() {
        return new Promise((resolve, reject) => {

            let sequence;

            this.metaDocList.forEach(metaDocListItem => {

                if (metaDocListItem.Datatype === 'MT') {
                    sequence = metaDocListItem.Sequence;
                    this.atpRANDocument.getTableDetails(metaDocListItem.MaxLength).then((result) => {

                        let tableDetails = this.atpRANDocument.tableDetails;
                        let header = this.atpRANDocument.header;

                        tableDetails.forEach(tableDetailsItem => {
                            let itm = {
                                tableId: metaDocListItem.MaxLength,
                                sequence: metaDocListItem.Sequence,
                                item: tableDetailsItem,
                                header: header
                            }
                            this.itemList.push(itm);
                            if (sequence === metaDocListItem.Sequence)
                                resolve();
                        });

                    }, (err) => {
                        reject(err);
                    });
                }
            });
            if (this.metaDocList.length === 0)
                resolve();
        },
        );
    }

    selectItem(item) {
        if (item.item.NELIST === null)
            item.item.NELIST = '';

        let tableItems = [];
        this.itemList.forEach(metaDocListItem => {
            if (item.tableId === metaDocListItem.tableId)
                tableItems.push(metaDocListItem);
        });

        this.pageUtility.navCtrl.push(ATPRANDocumentDynamicFormDetailPage, {
            documentName: this.documentName,
            metaTable: item,
            tableItems: tableItems
        });
    }

}
