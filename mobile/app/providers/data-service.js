import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';
import {UserConfig} from './user-config';
import {Toast, Alert} from 'ionic-angular';
import {TabsPage} from '../pages/tabs/tabs';

/*
 Generated class for the DataService provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class DataService {
    static get parameters() {
        return [[Http], [UserConfig]]
    }

    constructor(http, config) {
        this.http = http;
        this.data = null;
        this.config = config;
        this.BASE_URL = "http://115.28.71.169:9900/";
    }

    login(email, password, nav) {
        let url = this.BASE_URL + 'auth/login';
        let body = JSON.stringify({'email': email, 'password': password});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.post(url, body, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                console.log(data.msg);
                if (data.status == 200) {
                    this.showToast('登录成功！', 2000, nav);
                    nav.setRoot(TabsPage);
                    nav.pop();
                    this.config.setAuth(data.data.access_token, data.data.refresh_token);
                } else {
                    this.showToast('用户名或密码不正确...', 2000, nav);
                }
            }, error => {
                this.showToast('无法连接到服务器...', 2000, nav);
            });
    }

    register(email, nickname, password, nav) {
        let url = this.BASE_URL + 'auth/register';
        let body = JSON.stringify({'email': email, 'nickname': nickname, 'password': password});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.post(url, body, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                console.log(data.msg);
                if (data.status == 200) {
                    this.showAlert('注册成功！', '已向您邮箱发送一封激活邮件，点击激活后即可登录。', nav);
                    return true;
                } else {
                    this.showToast('注册失败...', 2000, nav);
                }
            }, error => {
                this.showToast('无法连接到服务器...', 2000, nav);
            });
        return false;
    }

    resetPassword(email, password, nav) {
        let url = this.BASE_URL + 'auth/reset';
        let body = JSON.stringify({'email': email, 'password': password});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.patch(url, body, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                console.log(data.msg);
                if (data.status == 200) {
                    this.showAlert('修改成功！', '已向您邮箱发送一封确认邮件，确认后即修改成功。', nav);
                    return true;
                } else {
                    this.showToast('修改失败...', 2000, nav);
                }
            }, error => {
                this.showToast('无法连接到服务器...', 2000, nav);
            });
        return false;
    }

    showToast(msg, dur, nav) {
        let t = Toast.create({
            message: msg,
            duration: dur
        });
        nav.present(t);
    }

    showAlert(title, sub, nav) {
        let t = Alert.create({
            title: title,
            subTitle: sub,
            buttons: ['OK']
        });
        nav.present(t);
    }

    load() {
        if (this.data) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            this.http.get('path/to/data.json')
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    this.data = data;
                    resolve(this.data);
                });
        });
    }
}

