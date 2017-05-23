import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ATPRANDocumentDynamicFormDetailActualPhoto } from './atpran-document-dynamic-form-detail-actual-photo';

@NgModule({
  declarations: [
    ATPRANDocumentDynamicFormDetailActualPhoto,
  ],
  imports: [
    IonicPageModule.forChild(ATPRANDocumentDynamicFormDetailActualPhoto),
  ],
  exports: [
    ATPRANDocumentDynamicFormDetailActualPhoto
  ]
})
export class ATPRANDocumentDynamicFormDetailActualPhotoModule {}
