import { Router } from '@angular/router';
import { ApiService } from './../shared/services/api.service';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { User } from '../users/user';
import { Permission } from '../users/permission';
import { Organization } from '../organizations/organization';
import { Store } from '@ngrx/store';
import { AuthState } from "app/auth/auth.reducer";
import { getCurrentUser } from "app/auth/auth.actions";
import { environment } from 'environments/environment';
import * as io from 'socket.io-client';

@Injectable()
export class AuthService {
    private static count = 0;
    public currentUser$: Observable<User>;
    public currentUserBehavior$: BehaviorSubject<User>;
    private authSocket: SocketIOClient.Socket;

    constructor(
        private apiService: ApiService,
        private store: Store<AuthState>,
        private router: Router
    ) {
        this.authSocket = io(`${environment.server_url}/auth`);
        // this.currentUserBehavior$ = new BehaviorSubject<User>(null);
        // this.currentUser$ = this.currentUserBehavior$.asObservable();

        // this.store.dispatch(getCurrentUser());
        // this.currentUser$ = Observable.of(null);
        // this.currentUser$ = this.store.select('auth').map((state: AuthState) => {
        //     return state.user;
        // });
    }

    setUser(user: User) {
        this.currentUser$ = Observable.of(user);
        // this.currentUserBehavior$.next(user);
        this.authSocket.removeAllListeners();
        this.authSocket.on(user._id + '_permission_changed', (data) => {
            // console.log(`${user._id} updated`);
            this.currentUser$ = Observable.of(data);
        });
        this.authSocket.on(user._id + '_profile_changed', (data) => {
            // console.log(`${user._id} updated`);
            this.currentUser$ = Observable.of(data);
        })
    }

    getUser(): Observable<User> {
        // console.log(AuthService.count++)
        return this.apiService.get('/user/current');
    }

    isAuthenticated(): Observable<boolean> {
        return this.currentUser$.map((user: User) => {
            return !!user;
        });
    }

    hasPermissions(permissions: Permission[], some?: boolean): Observable<boolean> {
        return this.apiService.post('/permissions', { permissions: permissions, some: some });
    }

    hasPermissionsForOrganization(permissions: Permission[], organizationId: any, some?: boolean): Observable<boolean> {
        return this.apiService.post(`/permissions/${organizationId}`, { permissions: permissions, some: some });
    }

    canApprove(): Observable<boolean> {
        return this.hasPermissions([Permission.APPROVE_CAR, Permission.APPROVE_CIVILIAN, Permission.APPROVE_SOLDIER], true);
    }

}