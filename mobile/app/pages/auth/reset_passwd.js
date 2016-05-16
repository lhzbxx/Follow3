import {Page, ViewController} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/auth/reset_passwd.html'
})

class ResetPasswd {
    constructor(viewCtrl: ViewController) {
        this.viewCtrl = viewCtrl;
    }

    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
}