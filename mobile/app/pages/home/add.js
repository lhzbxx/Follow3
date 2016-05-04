import {Page, NavController, Platform, Toast} from 'ionic-angular';
import {Http, Headers} from 'angular2/http';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/home/add.html'
})
export class Add {
    static get parameters() {
        return [Http, NavController, Platform];
    }
    constructor(http, navController, platform){
        this.http = http;
        this.addStar = Add;
        this.nav = navController;
        this.platform = platform;
        this.loading = true;
        this.result = null;
    }
    getResult() {
        var q = this.room;
        var p = this.plat;
        console.log(this.room);
        console.log(this.plat);
        if (q == '' || p == '')
            return;
        let body = JSON.stringify({'platform': p, 'query': q});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.post('http://www.lhzbxx.top:9900/star/add?platform=' + p + '&query=' + q, body, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                console.log(data);
                console.log(data.status);
                console.log(data.message);
                if (data.status == 200) {
                    this.result = data.data;
                    console.log(data.data);
                } else {
                    this.result = null;
                }
            }, error => {
                let t = Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
                this.nav.present(t)
            });
    }
}