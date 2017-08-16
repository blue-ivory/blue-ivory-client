import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { AuthActionTypes, fetchedCurrentUser } from "app/auth/auth.actions";
import { AuthService } from "app/auth/auth.service";


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) { }

    @Effect() getCurrentUser$ = this.actions$
        .ofType(AuthActionTypes.GET_CURRENT_USER)
        .mergeMap(() => this.authService.getUser())
        .map(user => fetchedCurrentUser(user));
}