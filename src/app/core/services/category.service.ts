import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'https://localhost:44366/api';
  constructor(private _dataApiService: DataService) {}

  getCategoriesWithSubcategoriesForMenu(): Observable<any> {
    const url = `${this.baseUrl}/category/categoryTreeForMenu`;
    return this._dataApiService.getAll<any>(url);
  }
}
