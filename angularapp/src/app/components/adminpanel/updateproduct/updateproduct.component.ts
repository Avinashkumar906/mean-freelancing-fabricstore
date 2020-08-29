import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product, ProductService } from 'src/app/service/product.service';
import { HttpService } from 'src/app/service/http.service';
import { DisposeBag } from '@ronas-it/dispose-bag';
import { OrderService } from 'src/app/service/order.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import * as _ from 'lodash'
import { User, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.scss']
})
export class UpdateproductComponent implements OnInit, OnDestroy {

  dispBag = new DisposeBag();
  key:string = '';
  productList:Array<Product> = this.createProductList(this.productService.getProducts());
  ostList:Array<Product> = this.createOstList(this.productService.getProducts());
  user:User;
  
  constructor(
    private productService:ProductService,
    private httpService:HttpService,
    private orderService:OrderService,
    private modalService: NgxSmartModalService,
    private userService:UserService,
  ) { 
    this.user = this.userService.getUser();
  }

  ngOnInit(): void {
    this.dispBag.add(
      this.productService.productsChanged.subscribe(
        (products:Array<Product>)=>{
          this.productList = _.cloneDeep(this.createProductList(products))
          this.ostList = _.cloneDeep(this.createOstList(products))
        }
      )
    )
  }

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
	}

  delete(product:Product){
    var result = confirm("Want to delete?");
    if(result){
      this.dispBag.add(
        this.httpService.deleteProduct(product).subscribe(
          (data:Product)=>{
            this.orderService.clearCart()
            this.productService.removeProduct(data)
          }
        )
      )
    }
  }

  updateProduct(product:Product){
    this.productService.isUpdateProduct.next(product);
    this.modalService.getModal('addproduct').open();
  }

  createOstList(list:Array<Product>){
    return  _.filter(list,(item)=>item['quantity'] <= 0)
  }

  createProductList(list:Array<Product>){
    return  _.filter(list,(item)=>item['quantity'] > 0)
  }
}
