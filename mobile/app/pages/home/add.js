import {Page, NavController, Platform, Toast} from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {ActionService} from '../../providers/action-service';


@Page({
    templateUrl: 'build/pages/home/add.html'
})
export class Add {

    static get parameters() {
        return [DataService, ActionService, NavController, Platform];
    }

    constructor(data, action, nav, platform){
        this.data = data;
        this.action = action;
        this.nav = nav;
        this.platform = platform;
        this.loading = true;
        this.result = null;
        this.addFailed = false;
    }

    getResult() {
        var q = this.room;
        var p = this.plat;
        console.log(this.room);
        console.log(this.plat);
        if (q == '' || p == '')
            return;
        this.data.addStar(p, q, this.nav)
            .then(
                data => {
                    console.log(data);
                    this.result = JSON.parse(data);
                }
            )
            .catch(
                data => {
                    this.addFailed = true;
                    this.result = null;
                }
            );
    }

    watchStar(result) {
        console.log(result);
        console.log(result.id);
        this.action.watch(result.id);
    }

    followStar(result) {
        console.log(result);
        console.log(result.id);
        this.data.followStar(result.id, this.nav);
    }

}