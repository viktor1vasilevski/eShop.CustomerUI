import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AuthService } from '../../../core/services/auth.service';
import { BasketService } from '../../../core/services/basket.service';
import { NotificationType } from '../../../core/enums/notification-type.enum';
import { CommonModule } from '@angular/common';

export interface Comment {
  id: string;
  orderId: string;
  userId: string;
  commentText?: string | null;
  createdBy: string;
  created: string; // ISO date string
  lastModifiedBy?: string | null;
  lastModified?: string | null;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };

  order?: {
    id: string;
  };
}

@Component({
  selector: 'app-product-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  product: any = '';
  quantity = 1;
  comments: Comment[] = [
    {
      id: '1',
      orderId: 'order-123',
      userId: 'user-456',
      commentText: 'This product is awesome! Highly recommend it.',
      createdBy: 'JohnDoe',
      created: new Date().toISOString(),
      lastModifiedBy: null,
      lastModified: null,
      user: {
        id: 'user-456',
        firstName: 'John',
        lastName: 'Doe',
      },
      order: {
        id: 'order-123',
      },
    },
  ];

  canComment: boolean = false;

  newCommentText: string = '';

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _authService: AuthService,
    private _basketService: BasketService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService
  ) {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });
  }

  ngOnInit(): void {
    this.loadProductById();
  }

  loadProductById() {
    debugger;
    const userId = this._authService.getUserId();
    this._productService.getProductById(this.productId, userId).subscribe({
      next: (response: any) => {
        this.product = response.data;
        this.canComment = response.data.canComment;
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
      image: this.product.image,
    };

    if (this._authService.isLoggedIn()) {
      const userId = this._authService.getUserId();
      this._basketService
        .updateItemQuantity(userId, basketItem.productId, basketItem.quantity)
        .subscribe({
          next: () => {
            this._notificationService.notify(
              NotificationType.Success,
              'item added'
            );

            this._basketService.getBasketByUserId(userId).subscribe({
              next: (response: any) => {
                this._basketService.setBasketItems(response.data.items);
              },
              error: (errorResponse: any) => {
                console.log(errorResponse);
              },
            });
          },
          error: (errorResponse: any) => {
            console.error('Error adding item:', errorResponse);
          },
        });
    } else {
      // Not logged in — keep items locally
      this._basketService.addLocalItem(basketItem);
      this._notificationService.notify(NotificationType.Success, 'item added');
    }
  }

  submitComment() {}
}
