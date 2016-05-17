import {Page, Alert, NavController} from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {UserConfig} from '../../providers/user-config';


@Page({
    templateUrl: 'build/pages/setting/setting.html'
})
export class Setting {
    static get parameters() {
        return [NavController, DataService, UserConfig];
    }
    constructor(nav, data, config) {
        this.nav = nav;
        this.data = data;
        this.config = config;
        this.settings = {
            isAutoNotify: false,
            isAppNotify: false,
            isNoDisturb: false
        };
        this.config.isAutoNotify().then(
            (value) => {
                this.settings.isAutoNotify = value;
            }
        );
        this.config.isAppNotify().then(
            (value) => {
                this.settings.isAppNotify = value;
            }
        );
        this.config.isNoDisturb().then(
            (value) => {
                this.settings.isNoDisturb = value;
            }
        );
    }

    differOpinion() {
        let alert = Alert.create({
            title: '意见反馈',
            message: "向lhzbxx提建议~",
            inputs: [
                {
                    name: 'advice',
                    placeholder: '建议...'
                }
            ],
            buttons: [
                {
                    text: '取消',
                    handler: data => {
                    }
                },
                {
                    text: '确认',
                    handler: data => {
                        this.data.feedback(data.advice, this.nav);
                    }
                }
            ]
        });
        this.nav.present(alert);
    }

    checkUpdate() {
        let alert = Alert.create({
            title: '',
            subTitle: '已是最新版本！',
            buttons: ['OK']
        });
        this.nav.present(alert);
    }
    
    rateMe() {
        AppRate.preferences.storeAppURL.ios = '<my_app_id>';
        AppRate.preferences.storeAppURL.android = 'market://details?id=top.lhzbxx.follow3';
        // AppRate.preferences.storeAppURL.blackberry = 'appworld://content/[App Id]/';
        // AppRate.preferences.storeAppURL.windows8 = 'ms-windows-store:Review?name=<the Package Family Name of the application>';
        AppRate.promptForRating(false);
    }
}
