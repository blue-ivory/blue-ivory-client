import { ApiService } from './../shared/b.domain/api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams } from '@angular/http';
import { Visitor } from './visitor';
import { environment } from 'environments/environment'

@Injectable()
export class VisitorService {

  private visitorsUrl = environment.api_url + '/visitor';

  constructor(private apiService: ApiService) { }

  public getVisitor(id: string): Observable<Visitor> {
    if (id) {
      return this.apiService.get(`/visitor/${id}`);
    } else {
      return Observable.of(null);
    }
  }
}
