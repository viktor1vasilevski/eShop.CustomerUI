import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../core/services/basket.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  basketItems: any[] = [];
  totalPrice = 0;

  constructor(
    private _basketService: BasketService,
    private _orderService: OrderService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.basketItems = this._basketService.getLocalBasketItems();
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  }

  onPay() {
    const userId = this._authService.getUserId();
    const placeOrderRequest = {
      userId: userId,
      totalAmount: this.totalPrice,
      items: this.basketItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    this._orderService.placeOrder(placeOrderRequest).subscribe({
      next: (response) => {
        this._basketService.clearBackendBasket(userId).subscribe({
          next: () => {
            this._basketService.clearLocalBasket();
            this._router.navigate(['/home']);
          },
          error: (errorResponse: any) => {},
        });
      },
      error: (err) => {
        alert('Payment failed: ' + err.message);
      },
    });
  }
}
