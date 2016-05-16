import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {Md5} from 'ts-md5/dist/md5';


@Page({
    templateUrl: 'build/pages/auth/login&register.html'
})
export class LoginAndRegister {
    static get parameters() {
        return [[NavController], [DataService]];
    }

    constructor(nav, data) {
        this.auth = 'login';
        this.nav = nav;
        this.data = data;
    }

    register() {
        let r = this.data.register(this.register_mail, this.register_nickname, Md5.hashStr(this.register_passwd), this.nav);
        if (r) {
            this.login_mail = this.register_mail;
            this.login_passwd = this.register_passwd;
            this.auth = 'login';
        }
    }

    login() {
        this.data.login(this.login_mail, Md5.hashStr(this.login_passwd), this.nav);
    }
    
    showResetPasswd() {
        let resetPasswd = Modal.create(ResetPasswd, {mail: this.login_mail});
        this.nav.present(resetPasswd);
    }
}

@Page({
    templateUrl: 'build/pages/auth/reset-passwd.html'
})
class ResetPasswd {
    static get parameters() {
        return [ViewController, NavParams, DataService, NavController];
    }

    constructor(viewCtrl, param, data, nav) {
        this.viewCtrl = viewCtrl;
        this.reset_mail = param.get('mail');
        this.data = data;
        this.nav = nav;
    }

    close() {
        this.viewCtrl.dismiss();
    }

    reset() {
        let r = this.data.resetPassword(this.reset_mail, Md5.hashStr(this.reset_passwd), this.nav);
        if (r) {
            close();
        }
    }
}
