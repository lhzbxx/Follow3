import {Page, ActionSheet, NavController, Platform} from 'ionic-angular';
import {Http} from 'angular2/http';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/Home/search.html'
})
export class Search {
    static get parameters() {
        return [Http, NavController, Platform];
    }
    constructor(http, navController, platform){
        this.http = http;
        this.search = Search;
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