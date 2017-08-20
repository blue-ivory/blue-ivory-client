import { ApiService } from './../shared/services/api.service';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from './user';
import { Organization } from '../organizations/organization';
import { Permission } from './permission';
import { AuthService } from '../auth/auth.service';
import { Collection } from '../classes/collection';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
  constructor(private apiService: ApiService,
    private authService: AuthService) { }

  public getUsers(page?: number, pageSize?: number, searchTerm?: string): Observable<Collection<User>> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('searchTerm', searchTerm ? searchTerm : '');
    if (page && pageSize) {
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
    }

    return this.apiService.get('/user', params);
  }

  public getUser(userID: string): Observable<User> {
    return this.apiService.get(`/user/${userID}`);
  }

  public setPermissions(userId: string, organization: Organization, permissions: Permission[]): Observable<User> {

    return this.apiService.put(`/user/${userId}/permissions`, { permissions: permissions, organizationId: organization._id });
  }

  public setOrganization(userId: string, organizationId: any): Observable<User> {
    return this.apiService.put(`/user/${userId}/organization`, { organizationId: organizationId });
  }

  public getApprovableUsersByOrganization(organizationId: any, isSoldier: boolean, hasCar: boolean) {
    let params: URLSearchParams = new URLSearchParams();
    if (isSoldier) {
      params.set('isSoldier', 'true');
    }
    if (hasCar) {
      params.set('hasCar', 'true');
    }
    return this.apiService.get(`/user/approvable/${organizationId}`, params);
  }

  public updatePhoneNumber(userId: string, phoneNumber: string): Observable<User> {
    return this.apiService.put(`/user/${userId}/phone`, { phoneNumber: phoneNumber });
  }
}
