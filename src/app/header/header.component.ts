import { Component, OnInit } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private adalSvc: MsAdalAngular6Service) {

  }

  appTitle: string = "Eklee Quiz";
  username: string;
  firstName: string;
  show: boolean;

  ngOnInit() {

    if (this.adalSvc.userInfo) {
      this.show = true;
      this.username = this.adalSvc.userInfo.userName;
      this.firstName = this.adalSvc.userInfo.profile.given_name;
    } else {
      this.show = false;
    }
  }

}
