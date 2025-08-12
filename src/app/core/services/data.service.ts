import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getAll<ResponseType>(
    url: string,
    params?: HttpParams
  ): Observable<ResponseType> {
    return this.http.get<ResponseType>(url, { params });
  }

  getById<ResponseType>(
    url: string,
    options?: { params?: HttpParams }
  ): Observable<ResponseType> {
    return this.http.get<ResponseType>(url, options);
  }

  post<RequestType, ResponseType>(
    url: string,
    data: RequestType,
    options?: { headers?: HttpHeaders }
  ): Observable<ResponseType> {
    return this.http.post<ResponseType>(url, data ?? null, options);
  }

  put<ResponseType>(url: string, body: any): Observable<ResponseType> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<ResponseType>(url, body, { headers });
  }

  patch<ResponseType>(url: string, body: any): Observable<ResponseType> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.patch<ResponseType>(url, body, { headers });
  }

  delete<ResponseType>(url: string): Observable<ResponseType> {
    return this.http.delete<ResponseType>(url);
  }
}
