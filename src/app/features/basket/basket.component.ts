import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';

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

  constructor(private _cartService: CartService) {}

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
    // For now, this could navigate to checkout or trigger a modal, etc.
    console.log('Proceeding to checkout...');
    // You might use a router:
    // this.router.navigate(['/checkout']);
  }
}
