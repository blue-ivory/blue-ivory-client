import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { User } from '../users/user';
import { Permission } from '../users/permission';


@Injectable()
export class RequestsGuard implements CanActivateChild {

    constructor(private router: Router,
        private authService: AuthService) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let requestsType = route.params['type'];

        if (requestsType === 'pending') {
            return this.authService.hasPermissions([Permission.APPROVE_CAR, Permission.APPROVE_CIVILIAN, Permission.APPROVE_SOLDIER], true);
        }

        return true;
    }

    canLoad(route: Router): Observable<boolean> | boolean {
        return this.authService.isAuthenticated();
    }
}