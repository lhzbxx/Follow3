import {App, Platform} from 'ionic-angular';
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
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            // StatusBar.overlaysWebView(true);
            StatusBar.backgroundColorByName("red");
            cordova.plugins.Keyboard.disableScroll(true);
            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.setAlias('JPush_1');
            var backCount = 0;
            let exitMsg = Toast.create({
                message: '再次点击返回退出...',
                duration: 3000
            });
            platform.ready().then(() => {
                document.addEventListener('backbutton', () => {
                    if (backCount === 0) {
                        backCount++;
                        this.nav.present(exitMsg);
                        timeout("backCount = 0", 3000);
                    } else {
                        this.exitApp();
                    }
                }, false);
            });
        });
    }
}
