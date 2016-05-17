import {Injectable} from 'angular2/core';
import {UserConfig} from './user-config';
import {Platform} from 'ionic-angular';


@Injectable()
export class ActionService {
    static get parameters(){
        return [[UserConfig], [Platform]];
    }

    constructor(config, platform) {
        this.config = config;
        this.platform = platform;
    }

    watch(star) {
        this.config.getAutoOpenApp()
            .then(
                value => {
                    if (value == "true") {
                        if (star.platform == 'PANDA') {
                            cordova.InAppBrowser.open("pandatv://openroom/" + star.serial, "_system", "location=true");
                        } else if (star.platform == 'DOUYU') {
                            if (this.platform.is('ios')) {
                                cordova.InAppBrowser.open("douyutv://" + star.serial, "_system", "location=true");
                            } else if (this.platform.is('android')) {
                                cordova.InAppBrowser.open("douyutvtest://?room_id=" + star.serial + "&isVertical=0&room_src=" + encodeURIComponent(star.cover), "_system", "location=true");
                            } else {
                                cordova.InAppBrowser.open(star.link, "_system", "location=true");
                            }
                        } else if (star.platform == 'ZHANQI') {
                            let info = JSON.parse(star.info);
                            cordova.InAppBrowser.open("zhanqi://?roomid=" + info.id, "_system", "location=true");
                        } else {
                            cordova.InAppBrowser.open(star.link, "_system", "location=true");
                        }
                    } else {
                        cordova.InAppBrowser.open(star.link, "_system", "location=true");
                    }
                }
            );
    }
    
    share(msg) {
        if (window.plugins.socialsharing) {
            window.plugins.socialsharing.share(msg,
                null, null,
                "http://follow3.lhzbxx.top");
        }
    }
}