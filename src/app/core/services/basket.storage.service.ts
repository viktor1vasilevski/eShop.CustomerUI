import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasketStorageService {
  private _basketItems = new BehaviorSubject<any>(this.loadFromStorage());
  basketItems$ = this._basketItems.asObservable();
  distinctItemCount$ = this.basketItems$.pipe(map((items) => items.length));

  private readonly storageKey = 'basket';

  constructor() {}

  private loadFromStorage(): any {
    const basket = localStorage.getItem(this.storageKey);
    if (basket) {
      try {
        return JSON.parse(basket) as any[];
      } catch {
        console.warn('Failed to parse basket from localStorage, resetting.');
        localStorage.removeItem(this.storageKey);
      }
    }
    return [];
  }

  setBasketItems(items: any): void {
    this.persist(items);
  }

  getLocalBasketItems(): any {
    return this.loadFromStorage();
  }

  addLocalItem(item: any): void {
    const items = this.loadFromStorage();
    const existing = items.find((i: any) => i.productId === item.productId);

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

  updateLocalItem(item: any): void {
    const items = this.loadFromStorage();
    const existing = items.find((i: any) => i.productId === item.productId);
    if (existing) {
    } else {
      items.push(item);
    }

    this.persist(items);
  }

  private persist(items: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this._basketItems.next(items);
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
}
