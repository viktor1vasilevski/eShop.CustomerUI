import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
  private baseUrl = 'https://localhost:7106/api';
  private readonly storageKey = 'basket';

  private _basketItems = new BehaviorSubject<BasketItem[]>(
    this.loadFromStorage()
  );
  basketItems$ = this._basketItems.asObservable();

  constructor(private _dataApiService: DataService) {}

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

  loadBasketFromStorage(): void {
    this._basketItems.next(this.loadFromStorage());
  }

  clearBasket(): void {
    localStorage.removeItem(this.storageKey);
    this._basketItems.next([]);
  }

  removeItem(productId: string): void {
    const updated = this._basketItems.value.filter(
      (i) => i.productId !== productId
    );
    this.persist(updated);
  }

  updateItemQuantity(productId: string, newQuantity: number): void {
    const current = [...this._basketItems.value];
    const item = current.find((i) => i.productId === productId);
    if (!item) return;

    // enforce bounds
    item.quantity = Math.max(1, Math.min(newQuantity, item.unitQuantity));
    this.persist(current);
  }

  addOrMergeItem(item: BasketItem): void {
    const current = [...this._basketItems.value];
    const existing = current.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + item.quantity,
        existing.unitQuantity
      );
    } else {
      current.push({ ...item });
    }
    this.persist(current);
  }

  /**
   * Merge a basket fetched from server with localStorage basket.
   * Strategy: prefer summing quantities (bounded by unitQuantity).
   */
  mergeServerBasket(serverItems: BasketItem[]): void {
    const local = [...this._basketItems.value];
    const mergedMap = new Map<string, BasketItem>();

    // start with local
    local.forEach((i) => mergedMap.set(i.productId, { ...i }));

    // merge server items
    serverItems.forEach((si) => {
      const existing = mergedMap.get(si.productId);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + si.quantity,
          existing.unitQuantity
        );
      } else {
        mergedMap.set(si.productId, { ...si });
      }
    });

    this.persist(Array.from(mergedMap.values()));
  }
}
