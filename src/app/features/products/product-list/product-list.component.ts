import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

export interface ProductRequest {
  unitPrice: number;
  subcategoryId: string;
  categoryId: string;
  skip: number;
  take: number;
}

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  productRequest: ProductRequest = {
    categoryId: '',
    subcategoryId: '',
    unitPrice: 0,
    skip: 0,
    take: 10,
  };

  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Reset request
      this.productRequest.categoryId = '';
      this.productRequest.subcategoryId = '';
      this.productRequest.unitPrice = 0;
      this.productRequest.skip = 0;
      this.productRequest.take = 10;

      if (params['subcategoryId']) {
        this.productRequest.subcategoryId = params['subcategoryId'];
      }

      if (params['categoryId']) {
        this.productRequest.categoryId = params['categoryId'];
      }

      this.loadProducts();
    });
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        this.products = response.data;
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }
}
