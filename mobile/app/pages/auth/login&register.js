import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';
import {DataService} from '../../providers/data-service';


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
        this.login_mail = this.register_mail;
        this.login_passwd = this.register_passwd;
        this.auth = 'login';
    }

    login() {
        this.data.login(this.login_mail, this.login_passwd);
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
        return [ViewController, NavParams, DataService];
    }

    constructor(viewCtrl, param, data) {
        this.viewCtrl = viewCtrl;
        this.reset_mail = param.get('mail');
        this.data = data;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    reset() {

    }
}
