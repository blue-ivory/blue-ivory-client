import { Observable } from 'rxjs';
import { Http, Headers, URLSearchParams, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable()
export class ApiService {

  constructor(private _http: Http) { }

  private getHeaders(): Headers {
    let headerConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return new Headers(headerConfig);
  }

  private formatErrors(error: any) {
    return Observable.throw(error.json());
  }

  get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
    return this._http.get(`${environment.api_url}${path}`, { withCredentials: true, headers: this.getHeaders(), search: params })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this._http.post(`${environment.api_url}${path}`, JSON.stringify(body), { withCredentials: true, headers: this.getHeaders() })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this._http.put(`${environment.api_url}${path}`, JSON.stringify(body), { withCredentials: true, headers: this.getHeaders() })
      .catch(this.formatErrors)
      .map((res: Response) => res.json());
  }

  delete(path: string): Observable<any> {
    return this._http.delete(`${environment.api_url}${path}`, { withCredentials: true, headers: this.getHeaders() })
      .catch(this.formatErrors);
  }
}
