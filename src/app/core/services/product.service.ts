import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:44344/api';
  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('categoryId', request.categoryId)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString());

    const url = `${this.baseUrl}/product`;
    return this._dataApiService.getAll<any>(url, params);
  }

  getProductById(id: string): Observable<any> {
    const url = `${this.baseUrl}/product/${id}`;
    return this._dataApiService.getById<any>(url);
  }
}
