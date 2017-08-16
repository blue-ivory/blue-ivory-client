import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { OrganizationsRoutingModule } from './organizations-routing.module';

import { OrganizationsComponent } from './organizations.component';
import { OrganizationsListComponent } from './list/list.component';
import { CreateOrganizationComponent } from './create/create.component';
import { CreateOrganizationDialogComponent } from './create/dialog/dialog.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    OrganizationsRoutingModule
  ],
  exports: [
    CreateOrganizationComponent
  ],
  declarations: [
    OrganizationsComponent,
    OrganizationsListComponent,
    CreateOrganizationComponent,
    CreateOrganizationDialogComponent
  ],
  entryComponents: [
    CreateOrganizationDialogComponent
  ]
})
export class OrganizationsModule { }
