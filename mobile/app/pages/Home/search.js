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
            this.stars = [];
            return;
        }
        this.http.get('http://www.lhzbxx.top:9900/star/search?query=' + encodeURI(q))
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
                    icon: !this.platform.is('ios') ? 'remove-circle' : null,
                    role: 'destructive',
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