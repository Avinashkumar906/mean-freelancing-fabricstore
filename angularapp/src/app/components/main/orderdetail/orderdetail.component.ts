import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/service/http.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/service/order.service';
import { DisposeBag } from '@ronas-it/dispose-bag';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit,OnDestroy {

  constructor(
    private route:ActivatedRoute,
    private httpService:HttpService,
  ) { }

  err:any;
  id:string;
  dispBag = new DisposeBag();
  order:Order;

  ngOnInit(): void {
    this.route.params.subscribe(
      (param)=>{
        this.id = param.id
        this.loadOrder()
      }
    )
  }

  ngOnDestroy(): void {
    this.dispBag.unsubscribe()
  }
  
  totalPrice(){
    let total = 0;
    this.order.items.forEach((item)=>{
      total = total + (item.cost * item.selectedQuantity)
    })
    return total;
  }

  loadOrder(){
    this.dispBag.add(
      this.httpService.getOrderById(this.id).subscribe(
        (order:Order)=>{
         if(order){
          this.order = order
         } else {
          this.err = new Error('no product found')
         }
        },
        err=>this.err = err
      )
    )
  }
}
