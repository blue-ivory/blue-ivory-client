import { User } from './../users/user';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { IntroductionDialogComponent } from "app/introduction/dialog/dialog.component";
import { MdDialog } from "@angular/material";
import { LoginDialogComponent } from "app/login/login.dialog.component";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private router: Router,
        private dialog: MdDialog,
        private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let isAuthenticated = this.authService.isAuthenticated();
        let hasOrganization = this.authService.currentUser$.map((user: User) => user && user.organization);
        // this.dialog.open(LoginDialogComponent, { disableClose: true });
        
        return Observable.forkJoin(isAuthenticated, hasOrganization).map(res => {
            let isAuthenticated = res[0];
            let hasOrganization = res[1];
            if (isAuthenticated) {
                if (hasOrganization) {
                    return true;
                } else {
                    this.dialog.open(IntroductionDialogComponent, { disableClose: true, backdropClass: 'introduction-backdrop', width: '750px' });
                }
            } else {
                return false;
            }
        });
    }

    canLoad(route: Router): Observable<boolean> | boolean {
        return this.authService.isAuthenticated();
    }
}