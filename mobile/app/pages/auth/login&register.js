import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';
import {Data} from '../../providers/data';

@Page({
    templateUrl: 'build/pages/auth/login&register.html',
    providers: [Data]
})

export class LoginAndRegister {
    static get parameters() {
        return [NavController];
    }

    constructor(nav, data) {
        this.auth = 'login';
        this.nav = nav;
        this.data = Data;
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
    templateUrl: 'build/pages/auth/reset_passwd.html'
})

class ResetPasswd {
    static get parameters() {
        return [ViewController, NavParams];
    }

    constructor(viewCtrl, param) {
        this.viewCtrl = viewCtrl;
        this.reset_mail = param.get('mail');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    reset() {

    }
}
