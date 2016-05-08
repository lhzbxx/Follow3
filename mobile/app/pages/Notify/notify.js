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
        this.platform.ready().then(() => {
            this.storage = new Storage(SqlStorage);
            this.storage.query('SELECT * FROM notifications').then((data) => {
                alert(data.res.rows);
                if(data.res.rows.length > 0) {
                    this.notifications = data.res.rows;
                }
            }, (error) => {
                alert("ERROR -> " + JSON.stringify(error.err));
            });
        });
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
