import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { BasketStorageService } from '../../core/services/basket.storage.service';
import { AuthStorageService } from '../../core/services/auth.storage.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
declare var bootstrap: any;

@Component({
  selector: 'app-basket',
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent implements OnInit, OnDestroy {
  basketItems: any[] = [];
  totalPrice: number = 0;

  private subscription?: Subscription;

  constructor(
    private router: Router,
    private _basketService: BasketService,
    private _authService: AuthService,
    private _authStorageService: AuthStorageService,
    private _basketStorageService: BasketStorageService,
    private _errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit() {
    // hydrate from storage if needed
    //this._basketService.loadBasketFromStorage();

    this.subscription = this._basketStorageService.basketItems$.subscribe(
      (items: any[]) => {
        debugger;
        this.basketItems = items;
        this.calculateTotal();
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearBasket(): void {
    if (this._authStorageService.isLoggedIn()) {
      const userId = this._authStorageService.getUserId();
      this._basketService.clearBackendBasket(userId).subscribe({
        next: (response: any) => {
          this._basketStorageService.clearLocalBasket();
        },
        error: (errorResponse: any) => {
          console.log(errorResponse);
        },
      });
    } else {
      this._basketStorageService.clearLocalBasket();
    }
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(item: any): void {
    //this._basketService.removeItem(item.productId);
  }

  updateQuantity(item: any, change: number): void {
    debugger;
    if (
      (change === -1 && item.quantity <= 1) ||
      (change === 1 && item.quantity >= item.unitQuantity)
    ) {
      return;
    }

    if (this._authStorageService.isLoggedIn()) {
      const userId = this._authStorageService.getUserId();
      const basketItem = { productId: item.productId, quantity: change };
      const request = {
        items: [basketItem],
      };
      this._basketService.updateUserBasket(userId, request).subscribe({
        next: () => {
          this._basketService.getBasketByUserId(userId).subscribe({
            next: (response: any) => {
              this._basketStorageService.setBasketItems(response.data.items);
            },
            error: (errorResponse: any) =>
              this._errorHandlerService.handleErrors(errorResponse),
          });
        },
        error: (err: any) => console.error(err),
      });
    } else {
      this._basketStorageService.updateLocalItemQuantity(
        item.productId,
        change
      );
    }
  }

  onCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToLogin(event: Event) {
    event.preventDefault();
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal =
        bootstrap.Modal.getInstance(modalElement) ||
        new bootstrap.Modal(modalElement);
      modal.hide();
    }

    setTimeout(() => {
      this.router.navigate(['/login'], { queryParams: { fromModal: true } });
    }, 300);
  }
}
