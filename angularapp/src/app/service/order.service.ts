import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from './product.service';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  order:Order = localStorage.getItem('order') ? JSON.parse(localStorage.getItem('order')) : new Order();
  orderChanged = new Subject<Order>()
  
  constructor() { }

  getOrder(){
    return this.order;
  }

  putOrder(order){
    this.order = order;
    localStorage.setItem('order',JSON.stringify(this.order))
    this.orderChanged.next(this.order)
  }

  addToOrder(product:Product){
    let inOrder = _.findIndex(this.order.items,{'_id':product._id})
    if(inOrder<0){
      this.order.items.push(product);
    } else {
      alert('Item availale in cart!')
    }
    localStorage.setItem('order',JSON.stringify(this.order))
    this.orderChanged.next(this.order)
  }
  
  removeFromOrder(product:Product){
    let inOrder = _.findIndex(this.order.items,{'_id':product._id})
    this.order.items.splice(inOrder,1)
    localStorage.setItem('order',JSON.stringify(this.order))
    this.orderChanged.next(this.order)
  }
  clearCart(){
    this.order = new Order()
    localStorage.removeItem('order')
    this.orderChanged.next(this.order)
  }

  getCount(){
    if(this.order){
      return this.order.items.length
    }
    else
      return 0
  }

}

// Interface for order model
export interface Order{
  _id:string,
  name:string,
  email:string,
  address:string,
  status:string,
  items:Array<Product>;
}

// Class for order model
export class Order{
  _id:string;
  name:string;
  email:string;
  address:string;
  status:string;
  items:Array<Product> = [];
}

