import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

export interface ProductRequest {
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
      this.productRequest.categoryId = '';
      this.productRequest.skip = 0;
      this.productRequest.take = 10;

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
