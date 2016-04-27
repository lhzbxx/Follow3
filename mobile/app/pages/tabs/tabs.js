import {Page} from 'ionic-angular';
import {Home} from '../Home/home';
import {Notify} from '../Notify/notify';
import {Setting} from '../Setting/setting';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = Home;
    this.tab2Root = Notify;
    this.tab3Root = Setting;
  }
}
