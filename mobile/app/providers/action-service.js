import {Injectable} from 'angular2/core';
import {UserConfig} from './user-config';


@Injectable()
export class Action {
    static get parameters(){
        return [[UserConfig]];
    }

    constructor(http, user) {
        this.user = user;
    }

    watch(star, autoOpenApp) {
        if (autoOpenApp) {
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
    
    share(msg) {
        if (window.plugins.socialsharing) {
            window.plugins.socialsharing.share(msg,
                null, null,
                "http://follow3.lhzbxx.top");
        }
    }
}