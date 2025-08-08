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
  /** number of distinct items */
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
    debugger;
    const current = [...this._basketItems.value];
    const item = current.find((i) => i.productId === productId);
    if (!item) return;

    // Clamp quantity between 1 and unitQuantity
    const clampedQuantity = Math.max(
      1,
      Math.min(newQuantity, item.unitQuantity)
    );

    if (item.quantity === clampedQuantity) {
      // No change needed
      return;
    }

    // Optimistically update local state
    const oldQuantity = item.quantity;
    item.quantity = clampedQuantity;
    this._basketItems.next(current);
    this.persist(current);

    let userId = this._authService.getUserId();

    // Patch backend
    this._dataApiService
      .patch(`${this.baseUrl}/basket/${userId}/items/${productId}`, {
        quantity: clampedQuantity,
      })
      .subscribe({
        next: () => {
          // Success: local state already updated
        },
        error: (err) => {
          console.error('Failed to update quantity on server', err);
          // Rollback local update on failure
          item.quantity = oldQuantity;
          this._basketItems.next(current);
          this.persist(current);
          // Optional: Notify user about the failure using a notification service
        },
      });
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

  /** total quantity (sum of item.quantity) */
  totalQuantity$ = this.basketItems$.pipe(
    map((items) => items.reduce((sum, i) => sum + (i.quantity || 0), 0))
  );

  updateItemQuantityServer(
    userId: string,
    productId: string,
    quantity: number
  ): Observable<any> {
    return this._dataApiService.patch(
      `${this.baseUrl}/basket/${userId}/items/${productId}`,
      { quantity }
    );
  }
}
