import {Injectable} from 'angular2/core';
import {Storage, LocalStorage} from 'ionic-angular';


@Injectable()
export class UserConfig {

    static get parameters(){
        return [];
    }

    constructor(data) {
        this.storage = new Storage(LocalStorage);
        this.ACCESS_TOKEN = "ACCESS_TOKEN";
        this.REFRESH_TOKEN = "REFRESH_TOKEN";
        this.SHOW_ONLY_ONLINE = "SHOW_ONLY_ONLINE";
        this.AUTO_OPEN_APP = "AUTO_OPEN_APP";
        this.ORDER_BY_FOLLOW = "ORDER_BY_FOLLOW";
        this.IS_AUTO_NOTIFY = "IS_AUTO_NOTIFY";
        this.IS_APP_NOTIFY = "IS_APP_NOTIFY";
        this.IS_NO_DISTURB = "IS_NO_DISTURB";
        this.LOGIN = "LOGIN";
        this.USER_MAIL = "USER_MAIL";
        this.USER_ID = "USER_ID";
        this.USER_NICKNAME = "USER_NICKNAME";
        this.HOT_STAR_MAX = 5;
        this.VERSION = "0.3.4";
    }

    getVersion() {
        return this.VERSION;
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

    getRefreshToken() {
        return this.storage.get(this.REFRESH_TOKEN).then((value) => {
            return value;
        });
    }

    logout() {
        this.storage.remove(this.LOGIN);
    }

    setShowOnlyOnline(value) {
        this.storage.set(this.SHOW_ONLY_ONLINE, value);
    }

    getShowOnlyOnline() {
        return this.storage.get(this.SHOW_ONLY_ONLINE).then((value) => {
            return value;
        });
    }

    setAutoOpenApp(value) {
        this.storage.set(this.AUTO_OPEN_APP, value);
    }

    getAutoOpenApp() {
        return this.storage.get(this.AUTO_OPEN_APP).then((value) => {
            return value;
        });
    }

    setOrderByFollow(value) {
        this.storage.set(this.ORDER_BY_FOLLOW, value);
    }

    getOrderByFollow() {
        return this.storage.get(this.ORDER_BY_FOLLOW).then((value) => {
            return value;
        });
    }

    hasLoggedIn() {
        return this.storage.get(this.LOGIN).then((value) => {
            return value;
        });
    }

    setIsAutoNotify(value) {
        this.storage.set(this.IS_AUTO_NOTIFY, value);
    }

    getIsAutoNotify() {
        return this.storage.get(this.IS_AUTO_NOTIFY).then((value) => {
            return value;
        });
    }

    setIsAppNotify(value) {
        this.storage.set(this.IS_APP_NOTIFY, value);
    }

    getIsAppNotify() {
        return this.storage.get(this.IS_APP_NOTIFY).then((value) => {
            return value;
        });
    }

    setIsNoDisturb(value) {
        this.storage.set(this.IS_NO_DISTURB, value);
    }

    getIsNoDisturb() {
        return this.storage.get(this.IS_NO_DISTURB).then((value) => {
            return value;
        });
    }

    setUserId(value) {
        this.storage.set(this.USER_ID, value);
    }

    getUserId() {
        return this.storage.get(this.USER_ID).then((value) => {
            return value;
        });
    }

    setUserNickname(value) {
        this.storage.set(this.USER_NICKNAME, value);
    }

    getUserNickname() {
        return this.storage.get(this.USER_NICKNAME).then((value) => {
            return value;
        });
    }

    setUserMail(value) {
        this.storage.set(this.USER_MAIL, value);
    }

    getUserMail() {
        return this.storage.get(this.USER_MAIL).then((value) => {
            return value;
        });
    }

    initUser() {
        this.setIsAppNotify(true);
        this.setIsNoDisturb(false);
        this.setAutoOpenApp(true);
        this.setShowOnlyOnline(false);
        this.setOrderByFollow(false);
    }

}