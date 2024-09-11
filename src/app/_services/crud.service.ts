import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T> {
  protected readonly _url!: string;
  constructor(protected _httpClient: HttpClient) { }

  public getAll(): Observable<T> {
    return this._httpClient.get<T>(this._url);
  }

  public get(id: string): Observable<T> {
    return this._httpClient.get<T>(`${this._url}/${id}`);
  }

  public add(data: T): Observable<T> {
    return this._httpClient.post<T>(this._url, data);
  }

  public update(data: T): Observable<T> {
    return this._httpClient.put<T>(this._url, data);
  }

  public delete(id: string): Observable<unknown> {
    return this._httpClient.delete<unknown>(`${this._url}/${id}`);
  }
}
