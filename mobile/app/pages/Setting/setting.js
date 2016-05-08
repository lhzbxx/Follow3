import {Page} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/setting/setting.html'
})
export class Setting {
    constructor() {
        this.settings = {
            isAutoNotify: true,
            isAppNotify: true,
            isNoDisturb: false
        };
    }

    differOpinion() {
        Alert.create({
            title: '意见反馈',
            message: "向lhzbxx提建议~",
            inputs: [
                {
                    name: 'title',
                    placeholder: 'Title'
                },
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
        }).show();
    }

    checkUpdate() {
        alert("您已是最新版！");
    }
    
    rateMe() {
        AppRate.preferences.storeAppURL.ios = '<my_app_id>';
        AppRate.preferences.storeAppURL.android = 'market://details?id=<package_name>';
        AppRate.preferences.storeAppURL.blackberry = 'appworld://content/[App Id]/';
        AppRate.preferences.storeAppURL.windows8 = 'ms-windows-store:Review?name=<the Package Family Name of the application>';
        AppRate.promptForRating(true);
    }
}
