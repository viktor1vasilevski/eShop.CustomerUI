import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
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
    private _authService: AuthService
  ) {}

  ngOnInit() {
    // hydrate from storage if needed
    //this._basketService.loadBasketFromStorage();

    this.subscription = this._basketService.basketItems$.subscribe(
      (items: any[]) => {
        this.basketItems = items;
        this.calculateTotal();
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearBasket(): void {
    if (this._authService.isLoggedIn()) {
      const userId = this._authService.getUserId();
      this._basketService.clearBackendBasket(userId).subscribe({
        next: (response: any) => {
          this._basketService.clearLocalBasket();
        },
        error: (errorResponse: any) => {
          console.log(errorResponse);
        },
      });
    } else {
      this._basketService.clearLocalBasket();
    }
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(item: any): void {
    this._basketService.removeItem(item.productId);
  }

  updateQuantity(item: any, change: number): void {
    if (
      (change === -1 && item.quantity <= 1) ||
      (change === 1 && item.quantity >= item.unitQuantity)
    ) {
      return;
    }

    if (this._authService.isLoggedIn()) {
      const userId = this._authService.getUserId();
      this._basketService
        .updateItemQuantity(userId, item.productId, change)
        .subscribe({
          next: () => {
            this._basketService.getBasketByUserId(userId).subscribe({
              next: (response: any) => {
                this._basketService.setBasketItems(response.data.items);
              },
              error: (errorResponse: any) => {
                console.log(errorResponse);
                
              }
            })


          },
          error: (err: any) => console.error(err),
        });
    } else {
      this._basketService.updateLocalItemQuantity(item.productId, change);
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
