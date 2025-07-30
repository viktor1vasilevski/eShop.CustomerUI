import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';
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
    private router: Router
  ) {}

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  clearBasket(): void {
    
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: any, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  removeItem(item: any): void {
    
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

  }

  onCheckout(): void {

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
