import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/service/http.service';
import { ProductService, Product } from 'src/app/service/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DisposeBag } from '@ronas-it/dispose-bag';
import { OrderService } from 'src/app/service/order.service';
import { User, UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit, OnDestroy {

  id:string;
  message = '  '
  file:File = null;
  env = environment;
  productForm:FormGroup;
  dispBag = new DisposeBag();

  constructor(
    private fBuilder:FormBuilder,
    private http:HttpService,
    private productService:ProductService,
    private orderService : OrderService,
    private userService:UserService,
  ) { 
    this.initForm();
  }

  initForm(){
    this.productForm = this.fBuilder.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      cost:['',[Validators.required]],
      quantity:['',[Validators.required]],
      type:['',[Validators.required]],
      description:['',[Validators.required]],
      colors:this.fBuilder.array([]),
      image:[''],
    })
  }

  ngOnInit(): void {
    this.dispBag.add(
      this.productService.isUpdateProduct.subscribe(
        (product:Product)=>{
          this.patchForm(product)
        }
      )
    )
  }

  patchForm(product:Product){
    this.initForm()
    let control = (this.productForm.get('colors') as FormArray);
    if(product){
      this.id = product._id;
      product.colors.forEach((item,index)=>{
        control.insert(index,new FormControl(item))
      })
      this.productForm.patchValue(product);
    } else {
      control.insert(0,new FormControl('white'))
      this.id = null;
      this.file = null;
    }
  }

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
	}

  newProduct(){
    this.message = null;
    if(this.file){
      let formdata = new FormData()
      formdata.append('file',this.file,this.file.name)
      formdata.append('body',JSON.stringify(this.productForm.value))
      this.dispBag.add(
        this.http.postProduct(formdata).subscribe(
          (product:Product)=>{
            this.message="Fabric added to portal"
            this.orderService.clearCart()
            this.productService.putProduct(product)
          },
          err=>this.message = err.error.message
        )
      )
    } else {
      this.message = "Please select a Imgae !"
    }
  }

  updateProduct(){
    this.message = null
    this.dispBag.add(
      this.http.updateProduct(this.productForm.value,this.id).subscribe(
        (product:Product)=>{
          this.message="Product updated !"
          this.orderService.clearCart()
          this.productService.patchedProduct(product)
        },
        err=>this.message = err.error.message
      )
    )
  }

  submit(){
    if(!this.id){
      this.newProduct()
    } else {
      this.updateProduct()
    }
  }

  reset(){
    this.initForm();
    let control = (this.productForm.get('colors') as FormArray);
    control.insert(0,new FormControl('white'))
    this.file = undefined;
    this.id = undefined;
    this.message = '  ';
  }

  handleFile(event){
    this.file = <File>event.target.files[0]
  }

  get productFormControl() {
    return this.productForm.controls;
  }

  get colorArrayControl(){
    return (this.productForm.get('colors') as FormArray).controls;
  }

  addColor(element){
    let control = (this.productForm.get('colors') as FormArray);
    control.push(new FormControl(element.value))
    element.value = '';
  }

  removeColor(index:number){
    let control = this.productForm.get('colors') as FormArray;
    if(control.length>1){
      control.removeAt(index)
    } else {
      alert('Atleast one color is required')
    }
  }

}
