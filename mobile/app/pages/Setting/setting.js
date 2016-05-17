import {Page, Alert, NavController} from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {UserConfig} from '../../providers/user-config';
import {LoginAndRegister} from '../auth/login&register';


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
        this.mail = '';
        this.config.getIsAutoNotify().then(
            (value) => {
                this.settings.isAutoNotify = value;
            }
        );
        this.config.getIsAppNotify().then(
            (value) => {
                this.settings.isAppNotify = value;
            }
        );
        this.config.getIsNoDisturb().then(
            (value) => {
                this.settings.isNoDisturb = value;
            }
        );
        this.config.getUserMail().then(
            (value) => {
                this.mail = value;
            }
        )
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
            buttons: ['OK']
        });
        this.data.version(this.nav)
            .then(
                data => {
                    alert.setSubTitle('已是最新版本~');
                    this.nav.present(alert);
                }
            )
            .catch(
                data => {
                    alert.setSubTitle('需要更新！');
                    this.nav.present(alert);
                }
            )
    }
    
    resetPassword() {
        let t = Alert.create({
            title: '重设密码',
            message: "输入新的密码...",
            inputs: [
                {
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password...'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        // Cancel
                    }
                },
                {
                    text: 'Reset',
                    handler: data => {
                        let navTransition = t.dismiss();
                        this.data.resetPassword(this.mail, data, this.nav)
                            .then(
                                data => {
                                    navTransition.then(() => {
                                        let m = Alert.create({
                                            title: '修改成功！',
                                            subTitle: '已向您邮箱发送一封确认邮件，确认后即修改成功。',
                                            buttons: ['OK']
                                        });
                                        this.nav.present(m);
                                    });
                                }
                            );
                        return false;
                    }
                }
            ]
        });
        this.nav.present(t);
    }

    logout() {
        this.nav.rootNav.setRoot(LoginAndRegister);
        // this.nav.pop();
        this.config.logout();
    }

    autoNotify() {
        this.settings.isAutoNotify = !this.settings.isAutoNotify;
        this.config.setIsAutoNotify(this.settings.isAutoNotify);
    }

    appNotify() {
        this.settings.isAppNotify = !this.settings.isAppNotify;
        this.config.setIsAppNotify(this.settings.isAppNotify);
    }

    noDisturb() {
        let t = Alert.create({
            title: '抱歉',
            subTitle: '该功能还未开放。',
            buttons: ['OK']
        });
        this.nav.present(t);
    }

    rateMe() {
        var customLocale = {};
        customLocale.title = "给Follow3评分";
        customLocale.message = "如果你喜欢使用Follow3，请给个好评吧！";
        customLocale.cancelButtonLabel = "残忍拒绝";
        customLocale.laterButtonLabel = "稍后再说";
        customLocale.rateButtonLabel = "棒棒哒";
        // AppRate.preferences.openStoreInApp = true;
        AppRate.preferences.useLanguage = 'zh-CN';
        AppRate.preferences.storeAppURL.ios = '<my_app_id>';
        AppRate.preferences.storeAppURL.android = 'market://details?id=top.lhzbxx.follow3';
        // AppRate.preferences.storeAppURL.blackberry = 'appworld://content/[App Id]/';
        // AppRate.preferences.storeAppURL.windows8 = 'ms-windows-store:Review?name=<the Package Family Name of the application>';
        AppRate.preferences.customLocale = customLocale;
        AppRate.promptForRating(true);
    }
}
