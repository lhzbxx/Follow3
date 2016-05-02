import {Page, Toast, ActionSheet, NavController, Platform, Alert} from 'ionic-angular';
import {Search} from './search';
import {UserConfig} from '../../providers/user_config'
import {Http} from 'angular2/http';
import {TimeAgoPipe} from 'angular2-moment';
import 'rxjs/Rx';

@Page({
    pipes: [TimeAgoPipe],
    providers: [UserConfig],
    templateUrl: 'build/pages/home/home.html'
})

export class Home {
    static get parameters() {
        return [Http, NavController, Platform, UserConfig];
    }

    constructor(http, nav, platform, config) {
        this.http = http;
        this.fetch(null);
        this.search = Search;
        this.nav = nav;
        this.platform = platform;
        this.config = config;
        this.setting = config.getPreference();
    }

    fetch(refresher) {
        this.http.get('http://www.lhzbxx.top:9900/user/follow?access_token=fKCixnowbvDYIxWJ')
            .map(res => res.json())
            .subscribe(data => {
                this.stars = data.data;
                if (refresher) {
                    refresher.complete()
                }
            }, error => {
                let t = Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
                this.nav.present(t)
            });
    }

    doRefresh(refresher) {
        this.fetch(refresher);
    }

    showAction(star) {
        let actionSheet = ActionSheet.create({
            title: star.nickname,
            buttons: [
                {
                    text: '跳转观看',
                    icon: !this.platform.is('ios') ? 'play' : null,
                    handler: () => {
                        this.platform.ready().then(() => {
                            if (star.platform == 'PANDA') {
                                cordova.InAppBrowser.open("pandatv://openroom/" + star.serial, "_system", "location=true");
                            }
                            if (star.platform == 'DOUYU') {
                                if (this.platform.is('ios')) {
                                    cordova.InAppBrowser.open("douyutv://" + star.serial, "_system", "location=true");
                                } else if (this.platform.is('android')) {
                                    cordova.InAppBrowser.open("douyutvtest://?room_id=" + star.serial + "&isVertical=1&room_src=" + encodeURIComponent(star.cover), "_system", "location=true");
                                } else {
                                    cordova.InAppBrowser.open(star.link, "_system", "location=true");
                                }
                            }
                            if (star.platform == 'ZHANQI') {
                                let info = JSON.parse(star.info);
                                cordova.InAppBrowser.open("zhanqi://?roomid=" + info.id, "_system", "location=true");
                            }
                            if (star.platform == 'QUANMIN') {
                                cordova.InAppBrowser.open(star.link, "_system", "location=true");
                            }
                        });
                    }
                },{
                    text: '分享到...',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        this.platform.ready().then(() => {
                            if (window.plugins.socialsharing) {
                                // window.plugins.socialsharing.share("我在Follow3上关注了" + star.nickname + "，实时获得开播信息。真的很好用！",
                                //     null, Array("http://7xsz4e.com2.z0.glb.clouddn.com/favicon.png", star.avatar, star.cover),
                                //     "http://www.lhzbxx.top");
                                window.plugins.socialsharing.share("我在Follow3上关注了" + star.nickname + "，实时获得开播信息。真的很好用！",
                                    null, null,
                                    "http://www.lhzbxx.top");
                            }
                        });
                    }
                },{
                    text: '取消关注',
                    icon: !this.platform.is('ios') ? 'remove-circle' : null,
                    role: 'destructive',
                    handler: () => {
                        this.doRefresh(null);
                    }
                },{
                    text: '取消',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        // Cancel
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    }

    showOptions() {
        let alert = Alert.create();
        alert.setTitle('Preference');
        alert.addInput({
            type: 'checkbox',
            label: '仅显示在线主播',
            value: 'showOnlyOnline',
            checked: this.setting.showOnlyOnline
        });
        alert.addInput({
            type: 'checkbox',
            label: '自动打开对应APP',
            value: 'autoOpenApp',
            checked: this.setting.autoOpenApp
        });
        alert.addInput({
            type: 'checkbox',
            label: '按照关注顺序排列',
            value: 'orderByFollow',
            checked: this.setting.orderByFollow
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Confirm',
            handler: data => {
                this.config.setPreference(data.indexOf('showOnlyOnline') > -1,
                    data.indexOf('autoOpenApp') > -1,
                    data.indexOf('orderByFollow') > -1);
            }
        });
        this.nav.present(alert);
    }
}