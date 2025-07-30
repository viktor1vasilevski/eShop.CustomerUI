import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from '../../core/services/storage.service';
import { Router } from '@angular/router';
import { BasketService } from '../../core/services/basket.service';
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
    private _basketService: BasketService,
    private _storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription = this._basketService.basketChanges$.subscribe((cart) => {
      this.basketItems = cart;
      this.calculateTotal();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearBasket(): void {
    this._basketService.clearGuestBasket();
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: any, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(item: any): void {
    this._basketService.removeItemFromGuestBasket(item.productId);
  }

  updateQuantity(item: any, change: number): void {
    const newQuantity = item.quantity + change;

    // Validate quantity boundaries
    if (newQuantity < 1) {
      return;
    }
    if (newQuantity > item.unitQuantity) {
      return;
    }

    if (this._storageService.isAuthenticated()) {
      // Logged-in user: update server cart
      // this._cartService.updateServerCartItemQuantity(item.productId, newQuantity).subscribe({
      //   next: () => {
      //     item.quantity = newQuantity;
      //     this._notificationService.success('Cart updated.');
      //   },
      //   error: (err) => {
      //     this._errorHandlerService.handleErrors(err);
      //   }
      // });
    } else {
      // Guest user: update localStorage cart
      const currentCart = this._basketService.getGuestBasket();
      const existing = currentCart.find((i) => i.productId === item.productId);
      if (existing) {
        this._basketService.updateGuestBasketItemQuantity(
          item.productId,
          newQuantity
        );
        item.quantity = newQuantity;
      }
    }
  }

  onCheckout(): void {
    if (!this._storageService.isAuthenticated()) {
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
      return;
    }
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
