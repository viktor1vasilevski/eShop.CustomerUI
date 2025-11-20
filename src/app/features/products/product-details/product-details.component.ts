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
import { CommentService } from '../../../core/services/comment.service';
import { SortOrder } from '../../../core/enums/sort-order.enum';
import { BasketStorageService } from '../../../core/services/basket.storage.service';
import { AuthStorageService } from '../../../core/services/auth.storage.service';

export interface CommentRequest {
  productId: string;
  skip: number;
  take: number;
  sortDirection: SortOrder;
  sortBy: string;
}

export interface Comment {
  commentText?: string | null;
  created: string;
  createdBy: string;
  rating: number;
}

@Component({
  selector: 'app-product-details',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  productId: string = '';
  userId: string | null = '';
  product: any = '';
  quantity = 1;
  comments: any[] = [];

  commentRequest: CommentRequest = {
    productId: '',
    skip: 0,
    take: 5,
    sortDirection: SortOrder.Descending,
    sortBy: 'created',
  };

  canComment: boolean = false;
  newCommentText: string = '';
  newCommentRating: number = 0;
  currentPage: number = 1;
  totalCount: number = 0;
  totalPages: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private _productService: ProductService,
    private _authService: AuthService,
    private _authStorageService: AuthStorageService,
    private _basketService: BasketService,
    private _commentService: CommentService,
    private _notificationService: NotificationService,
    private _errorHandlerService: ErrorHandlerService,
    private _basketStorageService: BasketStorageService
  ) {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.commentRequest.productId = this.productId;
    });
  }

  ngOnInit(): void {
    this.loadProductById();
    this.loadComments();
  }

  loadProductById() {
    this._productService.getProductById(this.productId).subscribe({
      next: (response: any) => {
        this.product = response.data;
        this.canComment = response.data.canComment;
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  loadComments() {
    this._commentService.getComments(this.commentRequest).subscribe({
      next: (response: any) => {
        this.comments = response.data;
        this.totalCount =
          typeof response?.totalCount === 'number' ? response.totalCount : 0;
        this.calculateTotalPages();
      },
      error: (errorResponse: any) => {
        this._errorHandlerService.handleErrors(errorResponse);
      },
    });
  }

  calculateTotalPages(): void {
    const pages = Math.ceil(this.totalCount / this.commentRequest.take);
    this.totalPages = Array.from({ length: pages }, (_, i) => i + 1);
  }

  addToBasket() {
    if (this.quantity < 1 || this.quantity > this.product.unitQuantity) {
      return;
    }

    const basketItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      unitQuantity: this.product.unitQuantity,
      image: this.product.image,
    };
    if (this._authStorageService.isLoggedIn()) {
      const item = {
        productId: basketItem.productId,
        quantity: basketItem.quantity,
      };
      const request = { items: [item] };

      this._basketService.updateUserBasket(request).subscribe({
        next: () => {
          this._notificationService.notify(
            NotificationType.Success,
            'item added'
          );

          this._basketService.getBasketByUserId().subscribe({
            next: (response: any) => {
              this._basketStorageService.setBasketItems(response.data.items);
            },
            error: (errorResponse: any) =>
              this._errorHandlerService.handleErrors(errorResponse),
          });
        },
        error: (errorResponse: any) =>
          this._errorHandlerService.handleErrors(errorResponse),
      });
    } else {
      this._basketStorageService.addLocalItem(basketItem);
      this._notificationService.notify(NotificationType.Success, 'item added');
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.commentRequest.skip = (page - 1) * this.commentRequest.take;
    this.loadComments();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.commentRequest.take = itemsPerPage;
    this.commentRequest.skip = 0;
    this.currentPage = 1;
    this.loadComments();
  }

  submitComment() {
    if (this.newCommentRating < 1 || this.newCommentRating > 5) {
      this._notificationService.notify(
        NotificationType.Info,
        'Please select a rating between 1 and 5.'
      );
      return;
    }

    const request = {
      productId: this.productId,
      commentText: this.newCommentText,
      rating: Number(this.newCommentRating),
    };
    debugger;
    this._commentService.createComment(request).subscribe({
      next: (response: any) => {
        this.comments.unshift(response.data);
        this.newCommentText = '';
        this.newCommentRating = 0;
      },
      error: (errorResponse: any) =>
        this._errorHandlerService.handleErrors(errorResponse),
    });
  }
}
