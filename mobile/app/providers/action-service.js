import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {UserConfig} from './user-config';


@Injectable()
export class Action {
    static get parameters(){
        return [[Http], [UserConfig]];
    }

    constructor(http, user) {
        // inject the Http provider and set to this instance
        this.http = http;
        this.user = user;
        this.BASE_URL = "http://www.lhzbxx.top:9900/"
    }
    
}