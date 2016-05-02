import {Page} from 'ionic-angular';
import {TimeAgoPipe} from 'angular2-moment';


@Page({
  pipes: [TimeAgoPipe],
  templateUrl: 'build/pages/notify/notify.html'
})
export class Notify {
  constructor() {

  }
}
