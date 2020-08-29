import { Component, OnInit } from '@angular/core';
import { HttpService } from './service/http.service';
import { ProductService, Product } from './service/product.service';
import { OrderService } from './service/order.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'angularapp';
  isAppLoaded:boolean;
  err:any;
  
  constructor(
    private httpService:HttpService,
    private produtService:ProductService,
    private orderService:OrderService,
    public ngxSmartModalService:NgxSmartModalService
  ){}

  ngOnInit(): void {
    this.httpService.getProducts().subscribe(
      (products:Array<Product>)=>{
        this.produtService.putProducts(products);
        this.isAppLoaded = true;
        this.adjustStock();
      },
      err=>{
        this.isAppLoaded = false;
        this.err = err;
      }
    )
  }

  adjustStock(){
    let order = this.orderService.getOrder()
    order.items.forEach((item:Product)=>{
      item.quantity = this.produtService.getProduct(item._id).quantity
    })
    this.orderService.putOrder(order)
  }
   
  signIn(){
    this.ngxSmartModalService.getModal('signin').open()
  }
}
