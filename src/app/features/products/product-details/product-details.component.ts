import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { BasketService } from '../../../core/services/basket.service';

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
    private _authService: AuthService,
    private _basketService: BasketService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,

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
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

addToBasket() {
  if (this.quantity < 1 || this.quantity > this.product.unitQuantity) {
    return;
  }

  const basketItem = {
    productId: this.product.id,
    name: this.product.name,
    price: this.product.unitPrice,
    quantity: this.quantity,
    unitQuantity: this.product.unitQuantity,
    image: this.product.image
  };

  if (this._authService.isLoggedIn()) {
    const localItems = this._basketService.getLocalBasketItems();

    if (localItems.length > 0) {
      // Merge local basket with backend basket
      this._basketService.mergeBasket(localItems).subscribe(() => {
        this._basketService.clearLocalBasket();
      });
    } else {
      const userId = this._authService.getUserId();
      this._basketService.updateItemQuantity(userId,
        basketItem.productId,
        basketItem.quantity
      ).subscribe();
    }

  } else {
    // Not logged in — keep items locally
    this._basketService.addLocalItem(basketItem);
  }

  console.log('Basket item added:', basketItem);
}

}
