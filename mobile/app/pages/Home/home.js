import {Page, Toast} from 'ionic-angular';
import {Search} from './search';
import {Http} from 'angular2/http';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/Home/home.html'
})
export class Home {
    static get parameters() {
        return [Http];
    }

    constructor(http) {
        this.http = http;
        this.fetch(null);
        this.search = Search;
    }

    fetch(refresher) {
        this.http.get('http://www.lhzbxx.top:9900/user/follow?access_token=fKCixnowbvDYIxWJ')
            .map(res => res.json())
            .subscribe(data => {
                this.stars = data.data;
                if (refresher) {
                    refresher.complete()
                }
                Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
            }, error => {
                Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
            });
    }

    doRefresh(refresher) {
        this.fetch(refresher);
    }
}