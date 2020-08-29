import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products:Array<Product>;
  productsChanged = new Subject<Array<Product>>()
  isUpdateProduct = new Subject<Product>()

  constructor() { }

  getProducts():Array<Product>{
    return this.products
  }

  adjustStock(items:Array<any>){
    items.forEach((item:Product)=>{
      let index = _.findIndex(this.products,{'_id':item._id})
      this.products[index].quantity = this.products[index].quantity-item.selectedQuantity;
    })
    this.productsChanged.next(this.products)
  }

  putProducts(data:Array<Product>){
    this.products = data;
    this.productsChanged.next(this.products)
  }
  removeProduct(product:Product){
    let index = _.findIndex(this.products,{'_id':product._id})
    this.products.splice(index,1)
    this.productsChanged.next(this.products)
  }
  putProduct(product:Product){
    this.products.push(product)
    this.productsChanged.next(this.products)
  }
  patchedProduct(product:Product){
    let index = _.findIndex(this.products,{'_id':product._id})
    this.products[index] = product;
    this.productsChanged.next(this.products)
  }
  getProduct(_id){
    let index = _.findIndex(this.products,{'_id':_id})
    return this.products[index]
  }

  removeQuantity(product:Product){
    let index = _.findIndex(this.products,{'_id':product._id})
    if(this.products[index].quantity > 0){
      this.products[index].quantity = this.products[index].quantity-product.quantity;
      this.productsChanged.next(this.products)
      return true
    } else {
      return false;
    }
  }

  addQuantity(product:Product){
    let index = _.findIndex(this.products,{'_id':product._id})
    ++this.products[index].quantity;
    this.productsChanged.next(this.products)
  }

  checkOutOfStock(){
    let ost = []
    this.products.forEach((item:Product)=>{
      if(item.quantity <= 0){
        ost.push(item)
      }
    })
    return ost;
  }
}


// Product Schema
export interface Product{
  _id: string,
  name: string,
  cost: number,
  quantity: number,
  type: string,
  description: string,
  colors: Array<string>,
  selectedColor:string,
  selectedQuantity:number,
  image: string,
}