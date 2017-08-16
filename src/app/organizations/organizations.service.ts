import { ApiService } from './../shared/b.domain/api.service';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Organization } from './organization';
import { Collection } from '../classes/collection';
import { User } from './../users/user';
import { Permission } from './../users/permission';


// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class OrganizationsService {
  constructor(private apiService: ApiService) { }

  getOrganizations(page?: number, pageSize?: number, searchTerm?: string): Observable<Collection<Organization>> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', searchTerm ? searchTerm : '');
    if (page && pageSize) {
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
    }

    return this.apiService.get('/organization', params);
  }

  getRequestableOrganizations(): Observable<Organization[]> {
    return this.apiService.get('/organization/requestable');
  }

  addOrganization(organization: Organization): Observable<Organization[]> {
    return this.apiService.post('/organization', { organization: organization });
  }

  getEditableOrganizations(user: User, permission: Permission, showStatistics?: boolean): Observable<Organization[]> {
    if (user.isAdmin) {
      let allOrganization = this.getOrganizations().map((collection: Collection<Organization>) => {
        if (showStatistics) {
          return collection.set;
        } else {
          return collection.set.map(organization => {
            let org = new Organization(organization.name);
            org._id = organization._id;

            return org;
          });
        }
      });

      return allOrganization;
    }
    let permissions = user.permissions.filter(perm => {
      return (perm.organizationPermissions.indexOf(permission) !== -1)
    });

    return Observable.of(permissions.map(permission => {
      return permission.organization;
    }));
  }
}
