import { Component, OnInit, OnDestroy } from '@angular/core';
import { User, UserService } from 'src/app/service/user.service';
import * as _ from 'lodash'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrderService, Order } from 'src/app/service/order.service';
import { Product, ProductService } from 'src/app/service/product.service';
import { HttpService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { DisposeBag } from '@ronas-it/dispose-bag';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit, OnDestroy {

  constructor(
    private userService:UserService,
    private formbuilder:FormBuilder,
    private orderService:OrderService,
    private smartModal:NgxSmartModalService,
    private httpService:HttpService,
    private router :Router,
    private productService:ProductService
  ) { 
    this.userForm = this.formbuilder.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      email:['',[Validators.required,Validators.email]],
      address:['',[Validators.required]]
    })
  }
  
  userForm:FormGroup;
  submitted:boolean = false;
  isStockAvailable:boolean = false;
  dispBag = new DisposeBag();
  order:Order = this.orderService.getOrder();
  user:User = _.cloneDeep(this.userService.getUser());
  
  ngOnInit(): void {
    this.user ? this.userForm.patchValue(this.user) : '';
    this.dispBag.add(
      this.userService.userChanged.subscribe(
        (user:User)=>{
          user ? this.userForm.patchValue(user) : '';
          this.user = user;
        },
        err=>console.log(err)
      )
    )
    this.dispBag.add(
      this.orderService.orderChanged.subscribe(
        (order:Order)=>this.order = order,
        err=>console.log(err)
      )
    )
  }

  openSignIn(){
    this.smartModal.getModal('signin').open()
  }

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
  }

  remove(item:Product){
    let dummy = _.cloneDeep(item)
    this.orderService.removeFromOrder(dummy)
  }

  getTotal(){
    let total = 0;
    for (let index = 0; index < this.order.items.length; index++) {
      const item = this.order.items[index];
      if(item.selectedQuantity > 0 && item.selectedQuantity<=item.quantity){
        total = total + (item.selectedQuantity * item.cost)
      } else {
        total = -1;
        break;
      }
    }
    return total;    
  }

  get userFormControl(){
    return this.userForm.controls;
  }

  availableStoct(x,y){
    if(y<=0){
      return `Enter valid quantity`;
    }
    if(y>0 && y<=x){
      return `${x-y} Mtr`
    } else {
      return `Out of Stock`
    }
  }

  checkOut(){
    if(this.getTotal() > 0){
      this.submitted = true;
      this.order.name = this.userForm.value.name;
      this.order.email = this.userForm.value.email
      this.order.address = this.userForm.value.address
      this.productService.adjustStock(this.order.items)
      this.dispBag.add(
        this.httpService.placeOrder(this.order).subscribe(
          (order:Order)=>{
            this.orderService.clearCart();
            this.router.navigate(['orderdetail',order._id])
          },
          err=>{
            this.submitted = false;
          }
        )
      )
    } else {
      alert('Selected quantity not available, Recheck to place order!')
    }
  }
}
