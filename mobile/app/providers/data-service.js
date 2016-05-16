import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';
import {UserConfig} from './user-config';

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

    login(email, password) {
        let url = this.BASE_URL + 'auth/login';
        let body = JSON.stringify({'email': email, 'password': password});
        let headers = new Headers({'Content-Type': 'application/json'});
        this.http.post(url, body, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                if (data.status == 200) {
                    this.addFailed = false;
                    let t = Toast.create({
                        message: '添加成功！',
                        duration: 2000
                    });
                    this.nav.present(t);
                    this.result = JSON.parse(data.data);
                } else {
                    let t = Toast.create({
                        message: '添加失败...',
                        duration: 2000
                    });
                    this.nav.present(t);
                    this.addFailed = true;
                    this.result = null;
                }
            }, error => {
                let t = Toast.create({
                    message: '无法连接到服务器...',
                    duration: 3000
                });
                this.nav.present(t)
            });
        // this.user.setAuth(access_token, refresh_token);
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

