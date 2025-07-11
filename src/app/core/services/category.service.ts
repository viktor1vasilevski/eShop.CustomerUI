import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'https://localhost:7106/api';
  constructor(private _dataApiService: DataService) {}

  getCategoriesWithSubcategoriesForMenu(): Observable<any> {
    const url = `${this.baseUrl}/category/categoriesWithSubcategoriesForMenu`;
    return this._dataApiService.getAll<any>(url);
  }
}
