import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 {
  constructor() {
    this.settings = {
      is_auto_notify: true,
      is_app_notify: true,
      is_no_disturb: false
    };
  }
}
