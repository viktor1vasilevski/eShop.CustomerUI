import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = 'https://localhost:7106/api';
  private readonly GUEST_BASKET_KEY = 'guest_basket';

  private basketSubject = new BehaviorSubject<any[]>(this.getGuestBasket());
  basketChanges$ = this.basketSubject.asObservable();

  constructor(private _dataApiService: DataService) {}

  // Add item to backend cart API
  addItemToServerBasket(item: any): Observable<any> {
    return this._dataApiService.post('/api/cart', item);
  }

  // Merge guest cart into backend cart
  mergeGuestBasketToBackend(
    userId: string | null,
    cartItems: any[]
  ): Observable<any> {
    if (!cartItems || cartItems.length === 0) return of(null);

    const url = `${this.baseUrl}/basket/merge/${userId}`;
    return this._dataApiService.post<any>(url, cartItems);
  }

  // Add item to guest cart locally and notify subscribers
  addItemToGuestBasket(item: any): void {
    const currentCart = this.getGuestBasket();
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

    this.saveGuestBasket(currentCart);
  }

  updateGuestBasketItemQuantity(productId: number, quantity: number): void {
    const currentCart = this.getGuestBasket();
    const existing = currentCart.find((i) => i.productId === productId);

    if (existing) {
      existing.quantity = quantity;
      this.saveGuestBasket(currentCart);
    }
  }

  getGuestBasket(): any[] {
    const raw = localStorage.getItem(this.GUEST_BASKET_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  // Save guest cart to localStorage and emit changes
  private saveGuestBasket(cart: any[]): void {
    localStorage.setItem(this.GUEST_BASKET_KEY, JSON.stringify(cart));
    this.basketSubject.next(cart);
  }

  removeItemFromGuestBasket(productId: number): void {
    const currentCart = this.getGuestBasket();
    const updatedCart = currentCart.filter(
      (item) => item.productId !== productId
    );
    this.saveGuestBasket(updatedCart);
  }

  // Clear guest cart and notify subscribers
  clearGuestBasket(): void {
    localStorage.removeItem(this.GUEST_BASKET_KEY);
    this.basketSubject.next([]);
  }
}
