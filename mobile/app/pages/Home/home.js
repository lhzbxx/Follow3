import {Page, ActionSheet, NavController, Platform, Alert} from 'ionic-angular';
import {Search} from './search';
import {UserConfig} from '../../providers/user-config';
import {DataService} from '../../providers/data-service';
import {ActionService} from '../../providers/action-service';
import {Http} from 'angular2/http';
import {TimeAgoPipe} from 'angular2-moment';
import 'rxjs/Rx';

@Page({
    pipes: [TimeAgoPipe],
    templateUrl: 'build/pages/home/home.html'
})

export class Home {
    static get parameters() {
        return [Http, NavController, Platform, UserConfig, DataService, ActionService];
    }

    constructor(http, nav, platform, config, data, action) {
        this.http = http;
        this.search = Search;
        this.nav = nav;
        this.platform = platform;
        this.config = config;
        this.data = data;
        this.action = action;
        this.setting = {
            showOnlyOnline: false,
            autoOpenApp: false,
            orderByFollow: false
        };
        this.platform.ready().then(() => {
            this.config.getShowOnlyOnline().then(
                (value) => {
                    this.setting.showOnlyOnline = value;
                    this.fetch(null);
                }
            );
            this.config.getAutoOpenApp().then(
                (value) => {
                    this.setting.autoOpenApp = value;
                }
            );
            this.config.getOrderByFollow().then(
                (value) => {
                    this.setting.orderByFollow = value;
                }
            );
        });
    }

    fetch(refresher) {
        this.data.fetchStars(this.setting.showOnlyOnline, this.setting.orderByFollow, this.nav)
            .then(
                data => {
                    this.stars = data;
                    if (refresher) {
                        refresher.complete();
                    }
                }
            )
            .catch(
                data => {
                    if (refresher) {
                        refresher.complete();
                    }
                }
            );
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
                            this.action.watch(star);
                            this.data.action('WATCH', star.id);
                        });
                    }
                }, {
                    text: '分享到...',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        this.platform.ready().then(() => {
                            this.action.share("我在Follow3上关注了" + star.nickname + "，实时获得开播信息。真的很好用！");
                            this.data.action('SHARE', star.id);
                        });
                    }
                }, {
                    text: '取消关注',
                    icon: !this.platform.is('ios') ? 'remove-circle' : null,
                    role: 'destructive',
                    handler: () => {
                        // todo: 这里会造成卡顿。
                        this.data.action('UNFOLLOW', star.id);
                        this.data.unfollowStar(star.id, this.nav)
                            .then(
                                data => {
                                    this.doRefresh(null);
                                }
                            );
                    }
                }, {
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
        let context = this;
        console.log(this.setting.showOnlyOnline=="true");
        alert.addInput({
            type: 'checkbox',
            label: '仅显示在线主播',
            value: 'showOnlyOnline',
            checked: this.setting.showOnlyOnline=="true"
        });
        alert.addInput({
            type: 'checkbox',
            label: '自动打开对应APP',
            value: 'autoOpenApp',
            checked: this.setting.autoOpenApp=="true"
        });
        alert.addInput({
            type: 'checkbox',
            label: '按照关注顺序排列',
            value: 'orderByFollow',
            checked: this.setting.orderByFollow=="true"
        });
        alert.addButton('Cancel');
        alert.addButton({
            text: 'Confirm',
            handler: data => {
                context.config.setShowOnlyOnline(data.indexOf('showOnlyOnline') > -1);
                context.config.setAutoOpenApp(data.indexOf('autoOpenApp') > -1);
                context.config.setOrderByFollow(data.indexOf('orderByFollow') > -1);
                // 注意，当涉及到LocalStorage存取操作的时候，只能设置为字符。
                context.setting.showOnlyOnline = data.indexOf('showOnlyOnline') > -1 ? "true" : "false";
                context.setting.autoOpenApp = data.indexOf('autoOpenApp') > -1 ? "true" : "false";
                context.setting.orderByFollow = data.indexOf('orderByFollow') > -1 ? "true" : "false";
                context.fetch(null);
            }
        });
        this.nav.present(alert);
    }
}