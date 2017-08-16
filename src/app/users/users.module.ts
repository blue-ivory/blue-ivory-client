import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';

import { UserService } from './user.service';

import { UsersGuard } from '../guards';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListComponent } from './list/list.component';
import { UserItemDialogComponent } from './list/item-dialog/item-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    UsersRoutingModule
  ],
  declarations: [
    UsersComponent,
    UsersListComponent,
    UserItemDialogComponent,
  ],
  providers: [
    UserService,
    UsersGuard
  ],
  entryComponents: [
    UserItemDialogComponent
  ]
})
export class UsersModule { }
