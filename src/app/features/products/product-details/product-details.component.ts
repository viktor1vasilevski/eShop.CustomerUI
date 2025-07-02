import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  imports: [FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: any = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _storageService: StorageService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _cartService: CartService
  ) {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadProductById();
  }

  loadProductById() {
    this._productService.getProductById(this.productId).subscribe({
      next: (response: any) => {
        this.product = response.data;
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }

  addToCart() {
    if (this.quantity < 1 || this.quantity > this.product.unitQuantity) {
      alert('Invalid quantity');
      return;
    }
    const cartItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.unitPrice,
      quantity: this.quantity,
      unitQuantity: this.product.unitQuantity,
      image: this.product.image
    };

    if (this._storageService.isAuthenticated()) {
      // Logged-in user: call API
      this._cartService.addItemToServerCart(cartItem).subscribe({
        next: () => {
          this._notificationService.success('Item added to your cart.');
        },
        error: (err) => {
          this._errorHandlerService.handleErrors(err);
        },
      });
    } else {
      // Guest user: store in localStorage
      this._cartService.addItemToGuestCart(cartItem);
      this._notificationService.success('Item added to your temporary cart.');
    }
  }
}
