import {Page, Modal, NavController} from 'ionic-angular';
import {ResetPasswd} from './reset_passwd';

@Page({
    templateUrl: 'build/pages/auth/login&register.html'
})

export class LoginAndRegister {
    constructor(nav: NavController) {
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
        let resetPasswd = Modal.create(ResetPasswd, { mail: this.login_mail });
        this.nav.present(resetPasswd);
    }
}


