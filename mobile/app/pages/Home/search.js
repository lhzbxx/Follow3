import {Page} from 'ionic-angular';
import {Http} from 'angular2/http';
import 'rxjs/Rx';


@Page({
    templateUrl: 'build/pages/Home/search.html'
})
export class Search {
    static get parameters() {
        return [Http];
    }
    constructor(http){
        this.http = http;
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
}