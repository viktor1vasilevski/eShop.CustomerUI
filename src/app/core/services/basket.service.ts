import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface BasketItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unitQuantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = 'https://localhost:44366/api';
  private readonly storageKey = 'basket';

  private _basketItems = new BehaviorSubject<BasketItem[]>(
    this.loadFromStorage()
  );
  basketItems$ = this._basketItems.asObservable();
  distinctItemCount$ = this.basketItems$.pipe(map((items) => items.length));

  constructor(
    private _dataApiService: DataService,
    private _authService: AuthService
  ) {}

  // --- backend fetch ---
  getBasketByUserId(userId: string): Observable<any[]> {
    return this._dataApiService.getById(`${this.baseUrl}/basket/${userId}`);
  }

  // --- local / reactive management ---
  private loadFromStorage(): BasketItem[] {
    const basket = localStorage.getItem(this.storageKey);
    if (basket) {
      try {
        return JSON.parse(basket) as BasketItem[];
      } catch {
        console.warn('Failed to parse basket from localStorage, resetting.');
        localStorage.removeItem(this.storageKey);
      }
    }
    return [];
  }

  private persist(items: BasketItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this._basketItems.next(items);
  }

  setBasketItems(items: BasketItem[]): void {
    this.persist(items);
  }

  getLocalBasketItems(): BasketItem[] {
    return this.loadFromStorage();
  }

  mergeBasket(items: BasketItem[]): Observable<void> {
    return this._dataApiService.post(`${this.baseUrl}/basket/merge`, items);
  }

  updateItemQuantity(
    userId: string | null,
    productId: string,
    quantity: number
  ): Observable<void> {
    return this._dataApiService.patch<void>(
      `${this.baseUrl}/basket/${userId}/items/${productId}`,
      { quantity }
    );
  }

  updateLocalItemQuantity(productId: any, change: number): void {
    const items = this.loadFromStorage();
    const existing = items.find((i: any) => i.productId === productId);

    if (existing) {
      const newQuantity = existing.quantity + change;
      if (newQuantity < 1 || newQuantity > existing.unitQuantity) return;

      existing.quantity = newQuantity;
      this.persist(items);
    }
  }

  clearLocalBasket(): void {
    localStorage.removeItem(this.storageKey);
    this._basketItems.next([]);
  }

  addLocalItem(item: BasketItem): void {
    const items = this.loadFromStorage();
    const existing = items.find((i) => i.productId === item.productId);

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + item.quantity,
        item.unitQuantity
      );
    } else {
      items.push(item);
    }

    this.persist(items);
  }

  updateLocalItem(item: BasketItem): void {
    const items = this.loadFromStorage();
    const existing = items.find((i) => i.productId === item.productId);
    debugger;
    if (existing) {
    } else {
      items.push(item);
    }

    this.persist(items);
  }
}
