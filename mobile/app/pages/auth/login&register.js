import {Page, Modal, NavController, ViewController, NavParams, Alert} from 'ionic-angular';
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
        let context = this;
        this.data.register(this.register_mail, this.register_nickname, Md5.hashStr(this.register_passwd), this.nav)
            .then(function () {
                context.login_mail = context.register_mail;
                context.login_passwd = context.register_passwd;
                context.auth = 'login';
            });
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
        let context = this;
        this.data.resetPassword(this.reset_mail, Md5.hashStr(this.reset_passwd), this.nav)
            .then(function () {
                let t = Alert.create({
                    title: '修改成功！',
                    subTitle: '已向您邮箱发送一封确认邮件，确认后即修改成功。',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            context.close();
                        }
                    }]
                });
                context.nav.present(t);
            });
    }
}
