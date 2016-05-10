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
        this.nav = NavController;
        this.notifications = null;
        this.platform = Platform;
        this.storage = new Storage(SqlStorage);
        this.refresh();
    }

    refresh() {
        this.platform.ready().then(() => {
            this.storage.query('SELECT * FROM notifications ORDER BY id DESC').then((data) => {
                this.notifications = [];
                if(data.res.rows.length > 0) {
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

    removeNotification(notification) {
        this.storage.query('DELETE FROM notifications WHERE id = ' + notification.id).then((data) => {
            console.log(JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error.err));
        });
        this.refresh();
    }

    watchDirect(notification) {
        //
    }

    shareOut() {
        //
    }

    readAll() {
        let confirm = Alert.create({
            title: '全部已读？',
            message: '该操作将移除所有的通知消息。',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        //
                    }
                },
                {
                    text: '确认',
                    handler: () => {
                        this.storage.query('DELETE FROM notifications');
                        this.refresh();
                    }
                }
            ]
        });
        this.nav.present(confirm);
    }
}
