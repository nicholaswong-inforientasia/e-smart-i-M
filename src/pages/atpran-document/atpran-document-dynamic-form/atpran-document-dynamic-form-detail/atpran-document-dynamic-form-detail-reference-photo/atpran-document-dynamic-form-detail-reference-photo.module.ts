import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ATPRANDocumentDynamicFormDetailReferencePhoto } from './atpran-document-dynamic-form-detail-reference-photo';

@NgModule({
  declarations: [
    ATPRANDocumentDynamicFormDetailReferencePhoto,
  ],
  imports: [
    IonicPageModule.forChild(ATPRANDocumentDynamicFormDetailReferencePhoto),
  ],
  exports: [
    ATPRANDocumentDynamicFormDetailReferencePhoto
  ]
})
export class ATPRANDocumentDynamicFormDetailReferencePhotoModule { }
