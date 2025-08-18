import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

export interface ProductRequest {
  unitPrice: number;
  subcategoryId: string;
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
    this.productRequest.subcategoryId =
      this.route.snapshot.paramMap.get('subcategoryId') ?? '';
    this.loadProducts();
  }

  loadProducts() {
    this._productService.getProducts(this.productRequest).subscribe({
      next: (response: any) => {
        this.products = response.data;
      },
      error: (errorResponse: any) => {
        debugger;
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }
}
