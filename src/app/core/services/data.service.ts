import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getAll<ResponseType>(url: string, params?: HttpParams): Observable<ResponseType> {
    return this.http.get<ResponseType>(url, { params });
  }

  getById<ResponseType>(url: string): Observable<ResponseType> {
    return this.http.get<ResponseType>(url);
  }
}
