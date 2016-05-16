import {Page, Modal, NavController, ViewController, NavParams} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/auth/login&register.html'
})

export class LoginAndRegister {
    static get parameters() {
        return [NavController];
    }

    constructor(nav) {
        this.auth = 'login';
        this.nav = nav;
    }

    register() {
        this.login_mail = this.register_mail;
        this.login_passwd = this.register_passwd;
        this.auth = 'login';
    }

    login() {

    }
    
    showResetPasswd() {
        // if (this.login_mail) {
        //     let resetPasswd = Modal.create(ResetPasswd, { mail: this.login_mail });
        // } else {
        //     let resetPasswd = Modal.create(ResetPasswd);
        // }
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
