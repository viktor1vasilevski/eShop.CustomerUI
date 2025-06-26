import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CommonModule } from '@angular/common';

export interface ProductRequest {
  name: string;
  categoryId: string;
  description: string;
  unitPrice: number;
  unitQuantity: number;
  subcategoryId: string;
  skip: number;
  take: number;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  productRequest: ProductRequest = {
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    unitPrice: 0,
    unitQuantity: 0,
    skip: 0,
    take: 10,
  };

  products: any[] = [];


  constructor(private route: ActivatedRoute,
    private _productService: ProductService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.productRequest.subcategoryId = params['subcategoryId'];
      
      this._productService.getProducts(this.productRequest).subscribe({
        next: (response: any) => {
          console.log(response);
          this.products = response.data;
          
        },
        error: (errorResponse: any) => {
          console.log(errorResponse);
          
        }
      });
    });
  }
}
