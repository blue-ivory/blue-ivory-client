import { Action } from '@ngrx/store';
import { User } from "app/users/user";
import { AuthActionTypes } from "app/auth/auth.actions";

export interface AuthState {
    user: User
}

const initialState = {
    user: null
}

export function reducer(state: AuthState = initialState, action: Action) {
    switch (action.type) {
        case AuthActionTypes.GET_CURRENT_USER: {
            return {
                user: null
            }
        }
        case AuthActionTypes.FETCHED_CURRENT_USER: {
            return {
                user: action.payload
            }
        }
        default: {
            return state;
        }
    }
}