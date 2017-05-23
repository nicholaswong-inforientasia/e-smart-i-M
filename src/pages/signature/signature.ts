import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { Signature } from '../../providers/signature';
import { PageUtility } from '../page.utility';
import { LocationValidationPage } from '../location-validation/location-validation';

/*
  Generated class for the Signature page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage {

  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  private signaturePadOptions: Object = {
    'minWidth': 1,
    'canvasWidth': 340,
    'canvasHeight': 200
  };

  public logout() {
    this.pageUtility.navCtrl.setRoot(LocationValidationPage);
  }

  constructor(public navCtrl: NavController, private pageUtility: PageUtility, private signature: Signature) { }

  ionViewDidLoad() {
    //to get the stored signature
    this.signature.getsignatureData().then((result) => {
      //console.log(this.signature.signatureData);
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

    //to set up the signaturepad

    this
      .signaturePad
      .set('minWidth', 1);
    this
      .signaturePad
      .clear();
  }
  drawClear() {
    this
      .signaturePad
      .clear();



  }

  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    console.log(this.signaturePad.toDataURL());

    this.signature.signatureData = this
      .signaturePad
      .toDataURL();


    this.signature.setnewSignatureData().then((result) => {
      console.log(this.signature.signatureData);
    }, (err) => {
      this.pageUtility.showMsg('Error', err);
    });

  }



  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }

}
