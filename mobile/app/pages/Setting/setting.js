import {Page, Alert, NavController} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/setting/setting.html'
})
export class Setting {
    static get parameters() {
        return [NavController];
    }
    constructor(NavController) {
        this.settings = {
            isAutoNotify: true,
            isAppNotify: true,
            isNoDisturb: false
        };
        this.nav = NavController;
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
        AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
        AppRate.preferences.storeAppURL.blackberry = 'appworld://content/[App Id]/';
        AppRate.preferences.storeAppURL.windows8 = 'ms-windows-store:Review?name=<the Package Family Name of the application>';
        AppRate.promptForRating(true);
    }
}
