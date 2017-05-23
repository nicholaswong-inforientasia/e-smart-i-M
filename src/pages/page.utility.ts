import { Injectable } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, MenuController, App } from 'ionic-angular';
import { LocationValidationPage } from './location-validation/location-validation';

@Injectable()
export class PageUtility {

    loading: Loading;
    navCtrl: NavController;

    constructor(private loadingCtrl: LoadingController, public alertCtrl: AlertController, private menuCtrl: MenuController, private app: App) {
        this.navCtrl = app.getActiveNav();

    }

    showLoader(msg) {
        console.log(msg);

        this.loading = this.loadingCtrl.create({
            content: msg
        });
        this.loading.present();
    }

    showMsg(title, msg) {
        console.log(msg);

        console.log(this.loading);
        if (this.loading !== undefined)
            this.loading.dismiss();

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present(prompt);
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.navCtrl.setRoot(page);
    }

    logout() {
        this.menuCtrl.close();
        this.navCtrl.setRoot(LocationValidationPage);
    }




}