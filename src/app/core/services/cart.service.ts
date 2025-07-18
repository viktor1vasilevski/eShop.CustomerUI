import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'https://localhost:7106/api';
  private readonly GUEST_CART_KEY = 'guest_cart';

  // BehaviorSubject to hold cart state reactively
  private cartSubject = new BehaviorSubject<any[]>(this.getGuestCart());
  cartChanges$ = this.cartSubject.asObservable();

  constructor(private _dataApiService: DataService) {}

  // Add item to backend cart API
  addItemToServerCart(item: any): Observable<any> {
    return this._dataApiService.post('/api/cart', item);
  }

  // Merge guest cart into backend cart
  mergeGuestCartToBackend(userId: string | null, cartItems: any[]): Observable<any> {
    if (!cartItems || cartItems.length === 0) return of(null);

    const url = `${this.baseUrl}/basket/merge/${userId}`;
    return this._dataApiService.post<any>(url, cartItems);
  }

  // Add item to guest cart locally and notify subscribers
  addItemToGuestCart(item: any): void {
    const currentCart = this.getGuestCart();
    const existing = currentCart.find((i) => i.productId === item.productId);
    debugger;

    if (existing) {
      if (existing.quantity >= existing.unitQuantity) {
        existing.quantit = existing.unitQuantity;
        return;
      }
      existing.quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    this.saveGuestCart(currentCart);
  }

  updateGuestCartItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.getGuestCart();
    const existing = currentCart.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity = quantity;
      this.saveGuestCart(currentCart);
    }
  }

  // Get guest cart from localStorage
  getGuestCart(): any[] {
    const raw = localStorage.getItem(this.GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  // Save guest cart to localStorage and emit changes
  private saveGuestCart(cart: any[]): void {
    localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  removeItemFromGuestCart(productId: number): void {
    const currentCart = this.getGuestCart();
    const updatedCart = currentCart.filter(
      (item) => item.productId !== productId
    );
    this.saveGuestCart(updatedCart);
  }

  // Clear guest cart and notify subscribers
  clearGuestCart(): void {
    localStorage.removeItem(this.GUEST_CART_KEY);
    this.cartSubject.next([]);
  }
}
