import {App, Platform, Toast, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {LoginAndRegister} from './pages/auth/login&register'
import {DataService} from './providers/data-service';
import {ActionService} from './providers/action-service';
import {UserConfig} from './providers/user-config';

@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    providers: [DataService, UserConfig, ActionService],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
    static get parameters() {
        return [[Platform], [UserConfig]];
    }

    constructor(platform, config) {
        this.config = config;
        platform.ready().then(() => {
            let context = this;
            window.plugins.jPushPlugin.init();
            this.config.hasLoggedIn().then(
                value => {
                    if (value) {
                        context.rootPage = TabsPage;
                    } else {
                        context.rootPage = LoginAndRegister;
                    }
                    Splashscreen.hide();
                }
            );
            StatusBar.styleDefault();
            if (platform.is('android'))
                StatusBar.backgroundColorByHexString("#285BB1");
            // StatusBar.show();

            cordova.plugins.Keyboard.disableScroll(true);

            // this.registerBackButtonListener();
            // var backCount = 0;
            // let exitMsg = Toast.create({
            //     message: '再次点击返回退出...',
            //     duration: 1000
            // });

            // document.addEventListener('backbutton', (e) => {
            //     e.preventDefault();
            //     if (backCount == 0) {
            //         backCount++;
            //         // this.nav.present(exitMsg);
            //         setTimeout(() => {
            //             backCount = 0;
            //         }, 1000);
            //         return;
            //     } else {
            //         this.exitApp();
            //     }
            // }, false);

            this.storage = new Storage(SqlStorage);
            this.storage.query('CREATE TABLE IF NOT EXISTS notifications (' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, received_at INTEGER, notified_at INTEGER,' +
                'content TEXT, serial INTEGER, platform TEXT, info TEXT, link TEXT, cover TEXT,' +
                'avatar TEXT, nickname TEXT, star_id INTEGER, status INTEGER default 0)');
            document.addEventListener("jpush.receiveNotification", (e) => {
                var nickname;
                var title;
                var notified_at;
                var avatar;
                var serial;
                var _platform;
                var info;
                var link;
                var cover;
                var star_id;
                if (platform.is('android')) {
                    serial = window.plugins.jPushPlugin.receiveNotification.extras.serial;
                    _platform = window.plugins.jPushPlugin.receiveNotification.extras.platform;
                    info = window.plugins.jPushPlugin.receiveNotification.extras.info;
                    link = window.plugins.jPushPlugin.receiveNotification.extras.link;
                    cover = window.plugins.jPushPlugin.receiveNotification.extras.cover;
                    star_id = window.plugins.jPushPlugin.receiveNotification.extras.star_id;
                    nickname = window.plugins.jPushPlugin.receiveNotification.extras.nickname;
                    title = window.plugins.jPushPlugin.receiveNotification.extras.title;
                    notified_at = window.plugins.jPushPlugin.receiveNotification.extras.notified_at;
                    avatar = window.plugins.jPushPlugin.receiveNotification.extras.avatar;
                } else {
                    serial = event.serial;
                    _platform = event.platform;
                    info = event.info;
                    link = event.link;
                    cover = event.cover;
                    star_id = event.star_id;
                    nickname = event.nickname;
                    title = event.title;
                    notified_at = event.notified_at;
                    avatar = event.avatar;
                }
                let query = 'INSERT INTO notifications (serial, platform, info, link, cover,' +
                    'star_id, received_at, content, nickname, notified_at, avatar)' +
                    'VALUES ("' + serial +
                    '", "' + _platform +
                    '", "' + encodeURI(info) +
                    '", "' + link +
                    '", "' + cover +
                    '", "' + star_id +
                    '", "' + new Date().getTime() +
                    '", "' + title +
                    '", "' + nickname +
                    '", "' + notified_at * 1000 +
                    '", "' + avatar +
                    '")';
                console.log(query);
                this.storage.query(query).then((data) => {
                    console.log(JSON.stringify(data.res))
                }, (error) => {
                    console.log("ERROR -> " + JSON.stringify(error.err));
                });
            }, false);
        });
    }
}
