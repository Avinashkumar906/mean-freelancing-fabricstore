import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UserService, User } from 'src/app/service/user.service';
import { DisposeBag } from '@ronas-it/dispose-bag';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  user:User = this.userService.getUser()
  dispBag = new DisposeBag()
  constructor(
    private smartModalService:NgxSmartModalService,
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.dispBag.add(
      this.userService.userChanged.subscribe(
        (user:User)=>this.user = user
      )
    )
  }

  logOut(){
    this.userService.logout()
  }

  openSignIn(){
    this.smartModalService.getModal('signin').open()
  }

  openSignUp(){
    this.smartModalService.getModal('signup').open()
  }
}
