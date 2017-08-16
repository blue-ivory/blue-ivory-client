import { Component, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { UserItemDialogComponent } from './item-dialog/item-dialog.component';
import { User } from '../user';
import { Organization } from '../../organizations/organization';
import { OrganizationsService } from '../../organizations/organizations.service';
import { Collection } from '../../classes/collection';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UsersListComponent {


  @Input('users') users: User[];

  constructor(private dialog: MdDialog,
    private organizationsService: OrganizationsService) {
  }

  openDialog(user: User) {
    let dialogRef = this.dialog.open(UserItemDialogComponent, { disableClose: false, width: '700px' });
    dialogRef.componentInstance.userId = user._id;
  }
}
