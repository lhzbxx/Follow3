import {Page, Toast, ActionSheet, NavController, Platform} from 'ionic-angular';
import {Search} from './search';
import {Http} from 'angular2/http';
import {TimeAgoPipe} from 'angular2-moment';
import 'rxjs/Rx';

@Page({
    pipes: [TimeAgoPipe],
    templateUrl: 'build/pages/Home/home.html'
})

export class Home {
    static get parameters() {
        return [Http, NavController, Platform];
    }

    constructor(http, navController, platform) {
        this.http = http;
        this.fetch(null);
        this.search = Search;
        this.nav = navController;
        this.platform = platform;
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
                            cordova.InAppBrowser.open(star.link, "_system", "location=true");
                        });
                    }
                },{
                    text: '分享到...',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        this.platform.ready().then(() => {
                            if (window.plugins.socialsharing) {
                                window.plugins.socialsharing.share("我在Follow3上关注了" + star.nickname + "，实时获得开播信息。真的很好用！",
                                    "Follow3", Array("http://7xsz4e.com2.z0.glb.clouddn.com/favicon.png", star.avatar, star.cover),
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
}