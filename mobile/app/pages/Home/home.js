import {Page, Toast, ActionSheet, NavController} from 'ionic-angular';
import {Search} from './search';
import {Http} from 'angular2/http';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/Home/home.html'
})
export class Home {
    static get parameters() {
        return [Http, NavController];
    }

    constructor(http, navController) {
        this.http = http;
        this.fetch(null);
        this.search = Search;
        this.nav = navController;
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
                    role: 'destructive',
                    handler: () => {
                        console.log('Destructive clicked');
                    }
                },{
                    text: '分享到...',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        console.log('Archive clicked');
                    }
                },{
                    text: '取消关注',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: () => {
                        console.log('Archive clicked');
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