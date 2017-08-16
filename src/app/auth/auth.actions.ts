import { Action } from '@ngrx/store';

export const AuthActionTypes = {
    GET_CURRENT_USER: 'GET_CURRENT_USER',
    FETCHED_CURRENT_USER: 'FETCHED_CURRENT_USER',
    UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER'
};

export function getCurrentUser(): Action {
    return {
        type: AuthActionTypes.GET_CURRENT_USER,
        payload: {}
    };
}

export function fetchedCurrentUser(user) {
    return {
        type: AuthActionTypes.FETCHED_CURRENT_USER,
        payload: user
    };
}
