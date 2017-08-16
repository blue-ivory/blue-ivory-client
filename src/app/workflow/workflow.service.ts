import { ApiService } from './../shared/b.domain/api.service';
import { Organization } from './../organizations/organization';
import { Task } from './task';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable()
export class WorkflowService {

  private workflowUrl = environment.api_url + '/organization';

  constructor(private apiService: ApiService) { }

  getWorkflow(id: any): Observable<Task[]> {
    return this.apiService.get(`/organization/${id}/workflow`);
  }

  setWorkflow(id: any, workflow: Task[]): Observable<Task[]> {
    return this.apiService.post(`/organization/${id}/workflow`, { workflow: workflow });
  }
}
