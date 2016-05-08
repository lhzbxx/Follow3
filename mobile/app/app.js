import {App, Platform, Toast} from 'ionic-angular';
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
            if (platform.is('android'))
                StatusBar.backgroundColorByHexString("#25312C");
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
        });
    }
}
