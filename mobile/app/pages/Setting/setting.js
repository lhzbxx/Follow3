import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/Setting/setting.html'
})
export class Setting {
  constructor() {
    this.settings = {
      is_auto_notify: true,
      is_app_notify: true,
      is_no_disturb: false
    };
  }
}
