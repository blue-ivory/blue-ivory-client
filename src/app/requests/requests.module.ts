import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { RequestsRoutingModule } from './requests-routing.module';

import { RequestsComponent } from './requests.component';
import { RequestsListComponent } from './list/list.component';
import { RequestItemComponent } from './list/item/item.component';

import { RequestService } from './request.service';

import { RequestsGuard } from '../guards';

import { CreateRequestComponent } from './create/create.component';
import { CreateRequestDialogComponent } from './create/dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    RequestsRoutingModule
  ],
  declarations: [
    RequestsComponent,
    RequestsListComponent,
    RequestItemComponent,
    CreateRequestComponent,
    CreateRequestDialogComponent
  ],
  exports: [
    CreateRequestComponent
  ],
  providers: [
    RequestService,
    RequestsGuard
  ],
  entryComponents: [
    CreateRequestDialogComponent
  ]
})
export class RequestsModule { }
