import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { StorageService } from '../../core/services/storage.service';
import { Router, RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-basket',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent implements OnInit, OnDestroy {
  basketItems: any[] = [];
  totalPrice: number = 0;

  private subscription?: Subscription;

  constructor(
    private _cartService: CartService,
    private _storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    debugger;
    this.subscription = this._cartService.cartChanges$.subscribe((cart) => {
      this.basketItems = cart;
      this.calculateTotal();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearBasket(): void {
    this._cartService.clearGuestCart();
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: any, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(item: any): void {
    this._cartService.removeItemFromGuestCart(item.productId);
  }

  onCheckout(): void {
    let isAuthenticated = this._storageService.isAuthenticated();

    if (!isAuthenticated) {
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
      this.router.navigate(['/login']);
    }, 300);
  }
}
