import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basket',
  imports: [CommonModule, FormsModule],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
})
export class BasketComponent implements OnInit {
basketItems = [
  { id: 1, name: 'Wireless Mouse', unitPrice: 29.99, quantity: 2 },
  { id: 2, name: 'Bluetooth Keyboard', unitPrice: 59.99, quantity: 1 },
  { id: 3, name: 'HD Monitor', unitPrice: 199.99, quantity: 1 }
];

  totalPrice: number = 0;

  ngOnInit() {
    // Load basket items, e.g., from localStorage or a service
    //this.loadBasket();
    //this.calculateTotal();
  }

  loadBasket() {
    // Example: load from localStorage (adjust as needed)
    const stored = localStorage.getItem('basket');
    this.basketItems = stored ? JSON.parse(stored) : [];

    // Optional: validate quantities or products here
  }

  saveBasket() {
    localStorage.setItem('basket', JSON.stringify(this.basketItems));
  }

  calculateTotal() {
    this.totalPrice = this.basketItems.reduce(
      (sum: any, item: any) => sum + item.product.unitPrice * item.quantity,
      0
    );
  }

  updateQuantity(item: any) {
    if (item.quantity < 1) item.quantity = 1;
    if (item.quantity > item.product.unitQuantity) {
      item.quantity = item.product.unitQuantity;
    }
    this.saveBasket();
    this.calculateTotal();
  }

  removeItem(item: any) {
    this.basketItems = this.basketItems.filter((i: any) => i !== item);
    this.saveBasket();
    this.calculateTotal();
  }

  checkout() {
    // TODO: Implement checkout logic (e.g., navigate to checkout page)
    alert('Proceeding to checkout...');
  }
}
