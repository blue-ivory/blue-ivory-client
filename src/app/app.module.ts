import { IntroductionModule } from './introduction/introduction.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule, MdNativeDateModule, DateAdapter } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import 'hammerjs';

import { reducer as authReducer } from './auth/auth.reducer';
import { AuthEffects } from './auth/auth.effects';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';
import { HomeModule } from './home';

import { SocketService } from './shared/b.domain/socket.service';
import { ApiService } from './shared/b.domain/api.service';

import { AuthGuard } from './guards';
import { AuthService } from './auth/auth.service';

import { AppComponent } from './app.component';
import { LoginDialogComponent } from "app/login/login.dialog.component";
import { Observable } from "rxjs/Observable";

export function createAppModule(user) {
  @NgModule({
    declarations: [
      AppComponent,
      LoginDialogComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      BrowserAnimationsModule,

      IntroductionModule,

      StoreModule.provideStore({
        auth: authReducer
      }),
      EffectsModule.run(AuthEffects),

      MaterialModule,

      SharedModule,
      HomeModule,
      AppRoutingModule
    ],
    providers: [
      SocketService,
      ApiService,
      AuthGuard,
      AuthService
    ],
    entryComponents: [LoginDialogComponent],
    bootstrap: [AppComponent]
  })
  class AppModule {
    constructor(socket: SocketService, dateAdapter: DateAdapter<Date>, authService: AuthService) {
      dateAdapter.setLocale('he');
      authService.setUser(user);
    }
  }

  return AppModule;
}