import {Page, ActionSheet, NavController, Platform, Toast} from 'ionic-angular';
import {Http} from 'angular2/http';
import {Add} from './add';
import {ActionService} from '../../providers/action-service';
import {DataService} from '../../providers/data-service';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/home/search.html'
})
export class Search {
    
    static get parameters() {
        return [Http, NavController, Platform, ActionService, DataService];
    }
    
    constructor(http, navController, platform, action, data){
        this.http = http;
        this.addStar = Add;
        this.nav = navController;
        this.platform = platform;
        this.action = action;
        this.data = data;
        this.searchFailed = false;
    }
    
    getItems(searchbar) {
        var q = searchbar.value;
        if (q == '') {
            this.stars = null;
            return;
        }
        this.data.searchStar(encodeURI(q), this.nav)
            .then(
                data => {
                    if (data.status == 200) {
                        this.searchFailed = false;
                        this.stars = data.data;
                    } else {
                        this.stars = null;
                        this.searchFailed = true;
                    }
                }
            );
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
                        });
                    }
                },{
                    text: '分享到...',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        this.platform.ready().then(() => {
                            this.action.share("我在Follow3上搜到了想要关注的" + star.nickname + "，实时获得他的开播信息。真的太棒了！");
                        });
                    }
                },{
                    text: star.user_id ? '取消关注' : '关注',
                    icon: !this.platform.is('ios') ? (star.user_id ? 'remove-circle' : 'add-circle') : null,
                    role: 'destructive',
                    handler: () => {
                        if (star.user_id) {
                            // 取消关注
                            this.data.unfollowStar(star.id, this.nav);
                            star.user_id = null;
                        } else {
                            // 关注
                            this.data.followStar(star.id, this.nav);
                            star.user_id = 1;
                        }
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