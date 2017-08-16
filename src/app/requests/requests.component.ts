import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RequestService } from './request.service';
import { Collection } from '../classes/collection';
import { Request } from './request';
import { IPageChangeEvent } from '@covalent/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {

  private page = 1;
  private pageSize = 10;
  private requestsType: string;
  private searchTerm: string;
  private newRequests = false;
  private requestsCollection$: Observable<Collection<Request>>;

  constructor(private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute) {

    this.requestsCollection$ = this.requestService.requests$;
    this.route.params.subscribe(params => {
      this.requestsType = params['type'];
      this.searchTerm = params['searchTerm'];
      this.page = 1;

      if (this.requestsType) {
        this.requestService.loadRequests(this.page, this.pageSize, this.searchTerm, this.requestsType);
        // this.requestsCollection$ = this.requestService.getRequests(this.page, this.pageSize, this.searchTerm, this.requestsType);
      }
    });
  }

  changePage(event: IPageChangeEvent): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.requestService.loadRequests(event.page, event.pageSize, this.searchTerm, this.requestsType);
    // this.requestsCollection$ = this.requestService.getRequests(this.page, this.pageSize, this.searchTerm, this.requestsType);
  }

  refreshRequests() {
    this.requestService.hasNewRequests = false;
    this.requestService.loadRequests(1, this.pageSize, this.searchTerm, this.requestsType);
    // this.requestsCollection$ = this.requestService.getRequests(1, this.pageSize, this.searchTerm, this.requestsType);

    this.page = 1;
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.requestService.loadRequests(1, this.pageSize, this.searchTerm, this.requestsType);
    // this.requestsCollection$ = this.requestService.getRequests(1, this.pageSize, this.searchTerm, this.requestsType);
  }
}
