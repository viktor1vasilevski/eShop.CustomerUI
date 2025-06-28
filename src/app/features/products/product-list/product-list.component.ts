import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';

export interface ProductRequest {
  unitPrice: number;
  subcategoryId: string;
  skip: number;
  take: number;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  productRequest: ProductRequest = {
    subcategoryId: '',
    unitPrice: 0,
    skip: 0,
    take: 10,
  };

  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.productRequest.subcategoryId = params['subcategoryId'];
      this.loadProducts();
    });
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.products = response.data;
        } else {
        }
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }
}
