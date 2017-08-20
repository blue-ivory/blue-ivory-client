import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from 'environments/environment';
import * as io from 'socket.io-client';
import { ApiService } from './../shared/services/api.service';
import { Request } from './request';
import { User } from '../users/user';
import { Visitor } from '../visitors/visitor';
import { Collection } from '../classes/collection';

import { TaskStatus } from 'app/workflow/task';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from 'app/auth/auth.service';

@Injectable()
export class RequestService {
    private requestsSocket: SocketIOClient.Socket;
    private requestsBehavior$: BehaviorSubject<Collection<Request>>;
    private requestsCollection: Collection<Request>;
    public isLoading = false;
    public hasNewRequests = false;
    public selectedRequestId: any;
    public requests$: Observable<Collection<Request>>;

    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {
        this.requestsSocket = io(`${environment.server_url}/request`);
        this.initializeSocketEvents();
        this.requestsBehavior$ = new BehaviorSubject<Collection<Request>>(new Collection([], 0));
        this.requests$ = this.requestsBehavior$.asObservable();
    }

    private initializeSocketEvents() {
        this.authService.currentUser$.subscribe((user: User) => {
            if (user && user.organization && user.organization.tags) {
                user.organization.tags.forEach(tag => {
                    this.requestsSocket.on(`new_request_for_${tag._id}`, () => {
                        this.hasNewRequests = true;
                    });
                });
            }
            this.requestsSocket.on(`new_request_for_${user.organization._id}`, () => {
                this.hasNewRequests = true;
            });
        });

        this.requestsSocket.on('delete_request', (requestId) => {
            this.removeLocalRequest(requestId);
        });
    }

    loadRequests(page?: number, pageSize?: number, searchTerm?: string, type?: string) {
        this.isLoading = true;

        this.getRequests(page, pageSize, searchTerm, type).subscribe((collection: Collection<Request>) => {
            this.requestsCollection = collection;
            this.requestsBehavior$.next(Object.assign({}, collection));
            setTimeout(() => { this.isLoading = false; }, 10);
        });
    }

    getRequests(page?: number, pageSize?: number, searchTerm?: string, type?: string): Observable<Collection<Request>> {
        searchTerm = searchTerm ? searchTerm : '';

        let params: URLSearchParams = new URLSearchParams();
        params.set('searchTerm', searchTerm);

        if (page && pageSize) {
            params.set('page', page.toString());
            params.set('pageSize', pageSize.toString());
        }

        return this.apiService.get(`/request/${type ? type : 'all'}`, params).map((collection: Collection<Request>) => {
            this.requestsCollection = collection;
            return collection;
        });
    }

    getRequest(id: any): Observable<Request> {
        return this.apiService.get(`/request/${id}`);
    }

    addRequest(request: Request, mailingList?: string[]): Observable<Request> {
        return this.apiService.post(`/request`, {
            request: request,
            mailingList: mailingList
        }).map((request: Request) => {
            this.requestsCollection.set.push(request);
            this.requestsCollection.totalCount++;
            this.requestsBehavior$.next(Object.assign({}, this.requestsCollection));

            return request;
        });
    }

    updateRequest(request: Request): Observable<Request> {
        delete request.workflow;
        return this.apiService.put(`/request/${request._id}`, { request: request });
    }

    removeRequest(id: any): Observable<void> {
        return this.apiService.delete(`/request/${id}`).map(() => {
            this.removeLocalRequest(id);
        });
    }

    changeTaskStatus(
        requestId: any,
        taskId: any,
        status: TaskStatus,
        needEscort?: boolean,
        needTag?: boolean,
        securityClearance?: number,
        confirmationNumber?: number
    ): Observable<Request> {
        return this.apiService.put(`/request/${requestId}/task/${taskId}`, {
            status: status,
            needEscort: !!needEscort,
            needTag: !!needTag,
            confirmationNumber: confirmationNumber,
            securityClearance: securityClearance
        });
    }

    private removeLocalRequest(requestId) {
        let index = this.requestsCollection.set.findIndex(req => req._id == requestId);
        if (index > -1) {
            this.requestsCollection.set.splice(index, 1);
            this.requestsCollection.totalCount--;
            this.requestsBehavior$.next(this.requestsCollection);
        }
    }
}
