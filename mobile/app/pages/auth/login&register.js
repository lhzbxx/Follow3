import {Page, Modal, NavController} from 'ionic-angular';


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
        let resetPasswd = Modal.create(ContactUs);
        this.nav.present(resetPasswd);
    }

    presentProfileModal() {
        let profileModal = Modal.create(Profile, { userId: 8675309 });
        profileModal.onDismiss(data => {
            console.log(data);
        });
        this.nav.present(profileModal);
    }

}


