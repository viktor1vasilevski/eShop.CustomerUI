import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  constructor(private router: Router, private _basketService: BasketService) {}

  ngOnInit() {
    // hydrate from storage if needed
    this._basketService.loadBasketFromStorage();

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
    this._basketService.clearBasket();
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
    const newQuantity = item.quantity + change;

    if (newQuantity < 1 || newQuantity > item.unitQuantity) {
      return;
    }

    this._basketService.updateItemQuantity(item.productId, newQuantity);
  }

  onCheckout(): void {
    // placeholder: implement actual checkout flow
    if (!this._basketService) {
      return;
    }
    console.log('Checking out with', this.basketItems);
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
