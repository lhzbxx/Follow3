import {App, Platform, Toast, Storage, SqlStorage} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';


@App({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
    static get parameters() {
        return [[Platform]];
    }

    constructor(platform) {
        this.rootPage = TabsPage;
        // this.nav = navController;
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            // if (platform.is('android'))
            //     StatusBar.backgroundColorByHexString("#25312C");
            // StatusBar.show();
            cordova.plugins.Keyboard.disableScroll(true);
            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.setAlias('JPush_1');

            // this.registerBackButtonListener();
            var backCount = 0;
            let exitMsg = Toast.create({
                message: '再次点击返回退出...',
                duration: 1000
            });

            this.storage = new Storage(SqlStorage);

            document.addEventListener('backbutton', (e) => {
                e.preventDefault();
                if (backCount == 0) {
                    backCount++;
                    // this.nav.present(exitMsg);
                    setTimeout(() => {
                        backCount = 0;
                    }, 1000);
                    return;
                } else {
                    this.exitApp();
                }
            }, false);

            this.storage.query('CREATE TABLE IF NOT EXISTS notifications (' +
                'id INTEGER PRIMARY KEY AUTOINCREMENT, received_at INTEGER, notified_at INTEGER,' +
                'content TEXT,' +
                'avatar TEXT, nickname TEXT, status INTEGER default 0)');

            document.addEventListener("jpush.receiveNotification", (e) => {
                var nickname;
                var
                if (platform.is('android')) {
                    alertContent = window.plugins.jPushPlugin.receiveNotification.extras.key1;
                } else {
                    alertContent = event.key1;
                }
                alert(alertContent);
                // this.storage.query('INSERT INTO notifications (received_at, content)' +
                //     'VALUES (' + new Date().getTime() / 1000 +
                //     ', "' + alertContent +
                //     '")').then((data) => {
                //     alert(JSON.stringify(data.res))
                // }, (error) => {
                //     alert("ERROR -> " + JSON.stringify(error.err));
                // });
            }, false);
        });
    }
}
