import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateOrganizationDialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-organization-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateOrganizationComponent {
  constructor(private dialog: MdDialog) { }

  openDialog() {
    let dialogRef = this.dialog.open(CreateOrganizationDialogComponent, { disableClose: false });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
