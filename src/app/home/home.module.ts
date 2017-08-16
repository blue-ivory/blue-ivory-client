import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SearchModule } from '../search';
import { SharedModule } from '../shared';
import { RequestsModule } from '../requests';
import { UsersModule } from '../users';
import { OrganizationsModule } from '../organizations';
import { WorkflowModule } from '../workflow';
import { IntroductionModule } from '../introduction';

import { OrganizationsService } from '../organizations/organizations.service';
import { VisitorService } from '../visitors/visitor.service';
import { HomeComponent } from './home.component';
import { SettingsModule } from "app/settings/settings.module";
import { SettingsService } from "app/settings/settings.service";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    SearchModule,
    RequestsModule,
    UsersModule,
    OrganizationsModule,
    WorkflowModule,
    SettingsModule,
    IntroductionModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [
    HomeComponent
  ],
  providers: [
    OrganizationsService,
    VisitorService,
    SettingsService
  ]
})
export class HomeModule { }
