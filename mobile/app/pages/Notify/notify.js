import {Page, NavController, Alert, Storage, SqlStorage, Platform} from 'ionic-angular';
import {TimeAgoPipe} from 'angular2-moment';
import {ActionService} from '../../providers/action-service';
import {DataService} from '../../providers/data-service';


@Page({
    pipes: [TimeAgoPipe],
    templateUrl: 'build/pages/notify/notify.html'
})
export class Notify {
    static get parameters() {
        return [DataService, NavController, Platform, ActionService];
    }

    constructor(data, nav, platform, action) {
        this.data = data;
        this.nav = nav;
        this.notifications = null;
        this.platform = platform;
        this.action = action;
        this.storage = new Storage(SqlStorage);
        this.refresh();
    }

    refresh() {
        this.notifications = null;
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
            this.data.action('REMOVE', notification.id);
            console.log(JSON.stringify(data.res));
        }, (error) => {
            console.log("ERROR -> " + JSON.stringify(error.err));
        });
        this.refresh();
    }

    watchDirect(notification) {
        this.action.watch(notification);
        this.data.action('WATCH', notification.id);
    }

    shareOut(notification) {
        this.action.share("我在Follow3上关注了" + notification.nickname + "，实时获得开播信息。真的很好用！");
        this.data.action('SHARE', notification.id);
    }

    readAll() {
        let confirm = Alert.create({
            title: '全部已读？',
            message: '该操作将移除所有的通知消息。',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        // Cancel
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
