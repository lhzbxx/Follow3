import {Page} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/Search/search.html'
})
export class Search {
    constructor(nav: NavController){
        this.nav = nav;
    }
}