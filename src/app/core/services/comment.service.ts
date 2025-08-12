import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'https://localhost:44366/api';

  constructor(private _dataApiService: DataService) {}

  createComment(request: any): Observable<any> {
    return this._dataApiService.post<any, any>(
      `${this.baseUrl}/comment`,
      request
    );
  }
}
