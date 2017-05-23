import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { PageUtility } from '../../page.utility';
import { BOMActual } from '../../../providers/bom-actual';
import { BOMActualMaterialPage } from '../bom-actual-material/bom-actual-material';
import { BOMActualConfigAddPage } from '../bom-actual-config/bom-actual-config-add/bom-actual-config-add';

/*
  Generated class for the BOMActualConfig page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-bom-actual-config',
  templateUrl: 'bom-actual-config.html'
})
export class BOMActualConfigPage implements OnInit {

  private bomActual: BOMActual;
  private pageUtility: PageUtility;
  private networkElement;
  private actualConfigList;
  private actualConfigListAsPlan;
  private actualConfigListNew;

  constructor(navParams: NavParams, pageUtility: PageUtility, bomActual: BOMActual) {
    this.networkElement = navParams.get('NetworkElement').Element;
    this.pageUtility = pageUtility;
    this.bomActual = bomActual;
  }

  ngOnInit(): void {
    // this.pageUtility.showLoader('Loading Actual Config...');

    this.bomActual.getLevel2ConfigList(this.networkElement).then((result) => {
      this.actualConfigList = this.bomActual.ActualConfigList;

      this.bomActual.getBOMActualConfigListAsPlan(this.networkElement).then((result) => {
        this.actualConfigListAsPlan = this.bomActual.ActualConfigListAsPlan;

        this.bomActual.getBOMActualConfigListNew(this.networkElement).then((result) => {
          this.actualConfigListNew = this.bomActual.ActualConfigListNew;

        }, (err) => {
          this.pageUtility.showMsg('Error', err);
        });
      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    // this.pageUtility.loading.dismiss();

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad BOMActualConfigPage');


  }

  selectItem(item) {
    this.pageUtility.navCtrl.push(BOMActualMaterialPage, {
      Config: item
    });
  }

  deleteItem(item) {
    this.bomActual.delBOMActualConfig(item.NEDesc, item.L2sno).then((result) => {
      this.bomActual.getBOMActualConfigListNew(item.NEDesc).then((result) => {

      }, (err) => {
        this.pageUtility.showMsg('Error', err);
      });
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });
  }

  getActualConfigDescAsPlan(actualConfig) {
    console.log(actualConfig);
    for (var i = 0, len = this.bomActual.ActualConfigList.length; i < len; i++) {
      if (this.bomActual.ActualConfigList[i].val === actualConfig.L2sno) {
        return this.bomActual.ActualConfigList[i].txt;
      }
    }
  }

  getActualConfigDescNew(actualConfig) {
    console.log(actualConfig);
    for (var i = 0, len = this.bomActual.ActualConfigList.length; i < len; i++) {
      if (this.bomActual.ActualConfigList[i].val === actualConfig.L2sno) {
        return this.bomActual.ActualConfigList[i].txt;
      }
    }
  }

  searchActualConfig() {
    this.pageUtility.navCtrl.push(BOMActualConfigAddPage, {
      NetworkElement: this.networkElement
    });
  }


}