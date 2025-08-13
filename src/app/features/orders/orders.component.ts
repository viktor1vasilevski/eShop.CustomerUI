import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { BasketService } from '../../core/services/basket.service';
import { AuthService } from '../../core/services/auth.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  userId: string | null = '';
  orders: any[] = [];
  totalSpent = 2;

  constructor(
    private _orderService: OrderService,
    private _basketService: BasketService,
    private _authService: AuthService,
    private _errorHandlerService: ErrorHandlerService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrderForUser();
  }

  get totalAmount(): number {
    return this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  loadOrderForUser() {
    this.userId = this._authService.getUserId();

    let request = {
      userId: this.userId,
    };

    this._orderService.getOrders(request).subscribe({
      next: (response: any) => {
        this.orders = response.data;
        console.log(this.orders);
      },
      error: (errorResponse: any) => {
        console.log(errorResponse);
      },
    });
  }
}
