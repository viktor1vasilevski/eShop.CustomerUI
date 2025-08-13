import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(
    private _dataApiService: DataService,
    private _authService: AuthService
  ) {}

  getComments(request: any): Observable<any> {
    const params = new HttpParams()
      .set('skip', request.skip.toString())
      .set('take', request.take.toString())
      .set('sortDirection', request.sortDirection)
      .set('sortBy', request.sortBy);

    const url = `${this.baseUrl}/comment`;
    return this._dataApiService.getAll<any>(url, params);
  }

  createComment(request: any): Observable<any> {
    debugger;
    const token = this._authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this._dataApiService.post<any, any>(
      `${this.baseUrl}/comment`,
      request,
      { headers }
    );
  }
}
