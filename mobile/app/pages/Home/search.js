import {Page, ActionSheet, NavController, Platform, Toast} from 'ionic-angular';
import {Http} from 'angular2/http';
import {Add} from './add'
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/home/search.html'
})
export class Search {
    static get parameters() {
        return [Http, NavController, Platform];
    }
    constructor(http, navController, platform){
        this.http = http;
        this.addStar = Add;
        this.nav = navController;
        this.platform = platform;
    }
    getItems(searchbar) {
        var q = searchbar.value;
        if (q == '') {
            this.stars = null;
            return;
        }
        this.http.get('http://www.lhzbxx.top:9900/user/search?query=' + encodeURI(q) + "&access_token=fKCixnowbvDYIxWJ")
            // JSON.stringify({"query": q}))
            .map(res => res.json())
            .subscribe(data => {
                console.log(data.status);
                if (data.status == 200) {
                    this.stars = data.data;
                    console.log(data.data);
                } else {
                    this.stars = [];
                }
            }, error => {
                let t = Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
                this.nav.present(t)
            });
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
                                    cordova.InAppBrowser.open("douyutvtest://?room_id=" + star.serial + "&isVertical=0&room_src=" + encodeURIComponent(star.cover), "_system", "location=true");
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
                        if (window.plugins.socialsharing) {
                            window.plugins.socialsharing.share("我在Follow3上搜到了想要关注的" + star.nickname + "，实时获得他的开播信息。真的太棒了！",
                                null, null,
                                "http://www.lhzbxx.top");
                        }
                    }
                },{
                    text: star.user_id ? '取消关注' : '关注',
                    icon: !this.platform.is('ios') ? (star.user_id ? 'remove-circle' : 'add-circle') : null,
                    role: 'destructive',
                    handler: () => {
                        if (star.user_id) {
                            // 取消关注
                        } else {
                            // 关注
                            star.user_id = 1;
                        }
                    }
                },{
                    text: '取消',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        this.nav.present(actionSheet);
    }
}