import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Collection } from '../classes/collection';
import { Organization } from './organization';
import { OrganizationsService } from './organizations.service';
import { IPageChangeEvent } from "@covalent/core";
@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent {

  private searchTerm: string;
  private organizationsCollection$: Observable<Collection<Organization>>;
  private page: number = 1;
  private pageSize: number = 10;

  constructor(private organizationsService: OrganizationsService,
    private router: Router,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.searchTerm = params["searchTerm"];

      this.organizationsCollection$ = this.organizationsService.getOrganizations(this.page, this.pageSize, this.searchTerm);
    })
  }

  changePage(event: IPageChangeEvent): void {
    this.page = event.page;
    this.pageSize = event.pageSize;
    this.organizationsCollection$ = this.organizationsService.getOrganizations(event.page, event.pageSize, this.searchTerm);
  }

}
