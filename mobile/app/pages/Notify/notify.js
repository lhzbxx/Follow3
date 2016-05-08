import {Page, NavController, Alert, Storage, SqlStorage, Platform} from 'ionic-angular';
import {TimeAgoPipe} from 'angular2-moment';


@Page({
    pipes: [TimeAgoPipe],
    templateUrl: 'build/pages/notify/notify.html'
})
export class Notify {
    static get parameters() {
        return [NavController, Platform];
    }

    constructor(NavController, Platform) {
        this.notifications = null;
        this.nav = NavController;
        this.platform = Platform;
        this.refresh();
    }

    refresh() {
        this.platform.ready().then(() => {
            this.storage = new Storage(SqlStorage);
            this.storage.query('SELECT * FROM notifications').then((data) => {
                if(data.res.rows.length > 0) {
                    this.notifications = [];
                    for (var i = 0; i < data.res.rows.length; i++) {
                        this.notifications.push(data.res.rows.item(i));
                    }
                }
            }, (error) => {
                console.log("ERROR -> " + JSON.stringify(error.err));
            });
        });
    }

    doRefresh(refresher) {
        this.refresh();
        refresher.complete();
    }

    readAll() {
        let confirm = Alert.create({
            title: '全部已读？',
            message: '该操作将移除所有的通知消息。',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: '确认',
                    handler: () => {
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        this.nav.present(confirm);
    }
}
