import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms'
import { UserService, User } from 'src/app/service/user.service';
import { HttpService } from 'src/app/service/http.service';
import { DisposeBag } from '@ronas-it/dispose-bag';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { async } from 'rxjs/internal/scheduler/async';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm:FormGroup;
  message:string = '  ';
  dispBag = new DisposeBag();
  
  constructor(
    private http:HttpService,
    private fBuilder:FormBuilder,
    private userService:UserService,
    private modalService:NgxSmartModalService,
    private productService:ProductService,
  ) { 
    this.loginForm = this.fBuilder.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,CustomValidators.validatePassword]]
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
  }

  ostAlert(user:User){
    if(user.role === 'admin'){
      let ostList = this.productService.checkOutOfStock().length
      ostList > 0 ? alert(`${ostList} item, out of stock!`) : '';
    }
  }
  
  submit(){
    this.message = null;
    this.dispBag.add(
      this.http.signIn(this.loginForm.value).subscribe(
        (user:User)=> {
          this.userService.login(user)
          this.modalService.close('signin')
          this.message = " ";
          this.loginForm.reset();
          this.ostAlert(user)
        },
        err => this.message = err.error.message
      )
    )
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  openSignUp(){
    this.modalService.closeAll()
    this.modalService.getModal('signup').open()
  }

}


//Custom validator
export class CustomValidators extends Validators {
  static validatePassword(control: FormControl) {
    if (control.value && control.value.length > 0) {
      // match the control value against the regular expression
      const matches = /^(?=.*\d).{6,20}$/.test(control.value)
      return matches == false ? { invalid_characters: matches } : null;
    } else {
      return null;
    }
  }
}
