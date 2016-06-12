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
            orderByFollow: false,
            showHottestStars: false
        };
        this.platform.ready().then(() => {
            this.config.getShowOnlyOnline().then(
                (value) => {
                    this.setting.showOnlyOnline = value;
                    this.fetch(null);
                }
            );
            this.config.getShowHottestStars().then(
                (value) => {
                    this.setting.showHottestStars = value;
                    this.fetchHottestStars();
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
    
    fetchHottestStars() {
        if (this.setting.showHottestStars == 'true') {
            this.data.fetchHottestStars()
                .then(
                    data => {
                        this.hot_stars = data;
                    }
                )
        } else {
            this.hot_stars = null;
        }
    }
    
    fetchRecommandStars() {
        // todo: 引入推荐。
    }

    fetch(refresher) {
        this.data.fetchFollowStars(this.setting.showOnlyOnline, this.setting.orderByFollow, this.nav)
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
        this.fetchHottestStars();
    }

    showAction(star, isFollowing) {
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
                    text: (isFollowing || star.user_id) ? '取消关注' : '关注',
                    icon: !this.platform.is('ios') ? (star.user_id ? 'remove-circle' : 'add-circle') : null,
                    role: 'destructive',
                    handler: () => {
                        if (isFollowing || star.user_id) {
                            // 取消关注
                            this.data.unfollowStar(star.id, this.nav);
                            this.data.action('UNFOLLOW', star.id);
                            star.user_id = null;
                        } else {
                            // 关注
                            this.data.followStar(star.id, this.nav);
                            this.data.action('FOLLOW', star.id);
                            star.user_id = 1;
                        }
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

        alert.addInput({
            type: 'checkbox',
            label: '仅显示在线主播',
            value: 'showOnlyOnline',
            checked: this.setting.showOnlyOnline=="true"
        });
        alert.addInput({
            type: 'checkbox',
            label: '显示热门主播列表',
            value: 'showHottestStars',
            checked: this.setting.showHottestStars=="true"
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
                context.config.setShowHottestStars(data.indexOf('showHottestStars') > -1);
                // 注意，当涉及到LocalStorage存取操作的时候，只能设置为字符。
                context.setting.showOnlyOnline = data.indexOf('showOnlyOnline') > -1 ? "true" : "false";
                context.setting.autoOpenApp = data.indexOf('autoOpenApp') > -1 ? "true" : "false";
                context.setting.orderByFollow = data.indexOf('orderByFollow') > -1 ? "true" : "false";
                context.setting.showHottestStars = data.indexOf('showHottestStars') > -1 ? "true" : "false";
                context.fetch(null);
                context.fetchHottestStars();
            }
        });
        this.nav.present(alert);
    }
}