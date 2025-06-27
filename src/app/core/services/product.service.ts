import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://localhost:7106/api';
  constructor(private _dataApiService: DataService) {}

  getProducts(request: any): Observable<any> {
    const params = new HttpParams()
      .set('subcategoryId', request.subcategoryId)
      .set('unitPrice', request.unitPrice)
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())

    const url = `${this.baseUrl}/product`;
    return this._dataApiService.getAll<any>(url, params);
  }
}
