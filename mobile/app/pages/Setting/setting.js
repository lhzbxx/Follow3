import {Page} from 'ionic-angular';


@Page({
  templateUrl: 'build/pages/setting/setting.html'
})
export class Setting {
  constructor() {
    this.settings = {
      isAutoNotify: true,
      isAppNotify: true,
      isNoDisturb: false
    };
  }
}
