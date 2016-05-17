import {Injectable} from 'angular2/core';
import {Storage, LocalStorage, Events} from 'ionic-angular';


@Injectable()
export class UserConfig {
    static get parameters(){
        return [[Events]];
    }
    constructor(events) {
        this.storage = new Storage(LocalStorage);
        this.events = events;
        this.ACCESS_TOKEN = "ACCESS_TOKEN";
        this.REFRESH_TOKEN = "REFRESH_TOKEN";
        this.SHOW_ONLY_ONLINE = "SHOW_ONLY_ONLINE";
        this.AUTO_OPEN_APP = "AUTO_OPEN_APP";
        this.ORDER_BY_FOLLOW = "ORDER_BY_FOLLOW";
        this.IS_AUTO_NOTIFY = "IS_AUTO_NOTIFY";
        this.IS_APP_NOTIFY = "IS_APP_NOTIFY";
        this.IS_NO_DISTURB = "IS_NO_DISTURB";
        this.LOGIN = "LOGIN"
    }
    setAuth(access_token, refresh_token) {
        this.storage.set(this.ACCESS_TOKEN, access_token);
        this.storage.set(this.REFRESH_TOKEN, refresh_token);
        this.storage.set(this.LOGIN, true);
    }
    getAccessToken() {
        return this.storage.get(this.ACCESS_TOKEN).then((value) => {
            return value;
        });
    }
    setPreference(showOnlyOnline, autoOpenApp, orderByFollow) {
        this.storage.set(this.SHOW_ONLY_ONLINE, showOnlyOnline);
        this.storage.set(this.AUTO_OPEN_APP, autoOpenApp);
        this.storage.set(this.ORDER_BY_FOLLOW, orderByFollow);
    }
    getPreference() {
        return {'showOnlyOnline': this.storage.get(this.SHOW_ONLY_ONLINE),
            'autoOpenApp': this.storage.get(this.AUTO_OPEN_APP),
            'orderByFollow': this.storage.get(this.ORDER_BY_FOLLOW)};
    }
    setSetting(isAutoNotify, isAppNotify, isNoDisturb) {
        this.storage.set(this.IS_AUTO_NOTIFY, isAutoNotify);
        this.storage.set(this.IS_APP_NOTIFY, isAppNotify);
        this.storage.set(this.IS_NO_DISTURB, isNoDisturb);
    }
    logout() {
        this.storage.remove(this.LOGIN);
    }
    hasLoggedIn() {
        return this.storage.get(this.LOGIN).then((value) => {
            return value;
        });
    }
    isAutoNotify() {
        return this.storage.get(this.IS_AUTO_NOTIFY).then((value) => {
            return value;
        });
    }
    isAppNotify() {
        return this.storage.get(this.IS_APP_NOTIFY).then((value) => {
            return value;
        });
    }
    isNoDisturb() {
        return this.storage.get(this.IS_NO_DISTURB).then((value) => {
            return value;
        });
    }
    // todo: 初始化用户的所有数据
    init() {

    }
}