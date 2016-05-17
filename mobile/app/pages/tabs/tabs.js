import {Page} from 'ionic-angular';
import {Home} from '../home/home';
import {Notify} from '../notify/notify';
import {Setting} from '../setting/setting';


@Page({
    templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
    constructor() {
        this.tab1Root = Home;
        this.tab2Root = Notify;
        this.tab3Root = Setting;
    }
}
