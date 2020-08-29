import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService, User } from 'src/app/service/user.service';
import { DisposeBag } from '@ronas-it/dispose-bag';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  user:User = this.userService.getUser()
  dispBag= new DisposeBag()
  constructor(
    private userService:UserService
  ) { }

  ngOnDestroy(): void {
    this.dispBag.unsubscribe()
  }

  ngOnInit(): void {
    this.dispBag.add(
      this.userService.userChanged.subscribe(
        (user:User)=>this.user = user
      )
    )

  }

}
