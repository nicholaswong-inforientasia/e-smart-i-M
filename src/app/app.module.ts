import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { AppUpdate } from '@ionic-native/app-update';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geofence } from '@ionic-native/geofence';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { Sim } from '@ionic-native/sim';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { SignaturePadModule } from 'angular2-signaturepad';

import { LocationValidationPage } from '../pages/location-validation/location-validation';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { PunchListPage } from '../pages/punch-list/punch-list';
import { PunchListDetailPage } from '../pages/punch-list/punch-list-detail/punch-list-detail';
import { PunchListDetailPhotoBeforePage } from '../pages/punch-list/punch-list-detail/punch-list-detail-photo-before/punch-list-detail-photo-before';
import { PunchListDetailPhotoAfterPage } from '../pages/punch-list/punch-list-detail/punch-list-detail-photo-after/punch-list-detail-photo-after';

import { BOMActualPage } from '../pages/bom-actual/bom-actual';
import { BOMActualConfigPage } from '../pages/bom-actual/bom-actual-config/bom-actual-config';
import { BOMActualConfigAddPage } from '../pages/bom-actual/bom-actual-config/bom-actual-config-add/bom-actual-config-add';
import { BOMActualConfigAddDetailPage } from '../pages/bom-actual/bom-actual-config/bom-actual-config-add/bom-actual-config-add-detail/bom-actual-config-add-detail';
import { BOMActualMaterialPage } from '../pages/bom-actual/bom-actual-material/bom-actual-material';
import { BOMActualMaterialDetailPage } from '../pages/bom-actual/bom-actual-material/bom-actual-material-detail/bom-actual-material-detail';
import { BOMActualMaterialDetailSerialNumberPage } from '../pages/bom-actual/bom-actual-material/bom-actual-material-detail/bom-actual-material-detail-serial-number/bom-actual-material-detail-serial-number';
import { BOMActualExtraMaterialAddPage } from '../pages/bom-actual/bom-actual-extra-material-add/bom-actual-extra-material-add';
import { BOMActualExtraMaterialAddDetailPage } from '../pages/bom-actual/bom-actual-extra-material-add/bom-actual-extra-material-add-detail/bom-actual-extra-material-add-detail';
import { BOMActualExtraMaterialDetailPage } from '../pages/bom-actual/bom-actual-extra-material-detail/bom-actual-extra-material-detail';
import { BOMActualExtraMaterialDetailSerialNumberPage } from '../pages/bom-actual/bom-actual-extra-material-detail/bom-actual-extra-material-detail-serial-number/bom-actual-extra-material-detail-serial-number';

import { ATPRANDocumentPage } from '../pages/atpran-document/atpran-document';
import { ATPRANDocumentDynamicFormPage } from '../pages/atpran-document/atpran-document-dynamic-form/atpran-document-dynamic-form';
import { ATPRANDocumentDynamicFormDetailPage } from '../pages/atpran-document/atpran-document-dynamic-form/atpran-document-dynamic-form-detail/atpran-document-dynamic-form-detail';
import { ATPRANDocumentDynamicFormDetailReferencePhoto } from '../pages/atpran-document/atpran-document-dynamic-form/atpran-document-dynamic-form-detail/atpran-document-dynamic-form-detail-reference-photo/atpran-document-dynamic-form-detail-reference-photo';
import { ATPRANDocumentDynamicFormDetailActualPhoto } from '../pages/atpran-document/atpran-document-dynamic-form/atpran-document-dynamic-form-detail/atpran-document-dynamic-form-detail-actual-photo/atpran-document-dynamic-form-detail-actual-photo';

import { GooglemapsPage } from '../pages/googlemaps/googlemaps';
import { SignaturePage } from '../pages/signature/signature';

import { Site } from '../providers/site';
import { Location } from '../providers/location';
import { Authentication } from '../providers/authentication';
import { Connection } from '../providers/connection';
import { Database } from '../providers/database';
import { FileTransfer } from '../providers/file-transfer';
import { Barcode } from '../providers/barcode';
import { GeoFence } from '../providers/geo-fence';
import { GoogleMaps } from '../providers/google-maps';

import { PunchList } from '../providers/punch-list';
import { BOMActual } from '../providers/bom-actual';
import { ATPRANDocument } from '../providers/atpran-document';
import { Signature } from '../providers/signature';

import { Config } from '../providers/config';
import { PageUtility } from '../pages/page.utility';
import { ProviderUtility } from '../providers/provider.utility';

@NgModule({
  declarations: [
    MyApp,
    LocationValidationPage,
    LoginPage,
    HomePage,
    PunchListPage,
    PunchListDetailPage,
    PunchListDetailPhotoBeforePage,
    PunchListDetailPhotoAfterPage,
    BOMActualPage,
    BOMActualConfigPage,
    BOMActualConfigAddPage,
    BOMActualConfigAddDetailPage,
    BOMActualMaterialPage,
    BOMActualMaterialDetailPage,
    BOMActualMaterialDetailSerialNumberPage,
    BOMActualExtraMaterialAddPage,
    BOMActualExtraMaterialAddDetailPage,
    BOMActualExtraMaterialDetailPage,
    BOMActualExtraMaterialDetailSerialNumberPage,
    ATPRANDocumentPage,
    ATPRANDocumentDynamicFormPage,
    ATPRANDocumentDynamicFormDetailPage,
    ATPRANDocumentDynamicFormDetailReferencePhoto,
    ATPRANDocumentDynamicFormDetailActualPhoto,
    GooglemapsPage,
    SignaturePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    SignaturePadModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LocationValidationPage,
    LoginPage,
    HomePage,
    PunchListPage,
    PunchListDetailPage,
    PunchListDetailPhotoBeforePage,
    PunchListDetailPhotoAfterPage,
    BOMActualPage,
    BOMActualConfigPage,
    BOMActualConfigAddPage,
    BOMActualConfigAddDetailPage,
    BOMActualMaterialPage,
    BOMActualMaterialDetailPage,
    BOMActualMaterialDetailSerialNumberPage,
    BOMActualExtraMaterialAddPage,
    BOMActualExtraMaterialAddDetailPage,
    BOMActualExtraMaterialDetailPage,
    BOMActualExtraMaterialDetailSerialNumberPage,
    ATPRANDocumentPage,
    ATPRANDocumentDynamicFormPage,
    ATPRANDocumentDynamicFormDetailPage,
    ATPRANDocumentDynamicFormDetailReferencePhoto,
    ATPRANDocumentDynamicFormDetailActualPhoto,
    GooglemapsPage,
    SignaturePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Storage, Site, Location, Authentication, PunchList, BOMActual, ATPRANDocument, Config, PageUtility,
    ProviderUtility, Connection, Database, FileTransfer, Barcode, AppUpdate, Camera, BarcodeScanner, Geofence, GeoFence, AppVersion, Device, Sim, File, GoogleMaps, Transfer,
    TransferObject, SplashScreen, StatusBar, Diagnostic, Geolocation, LaunchNavigator, SQLite, Network, Signature]
})
export class AppModule { }
