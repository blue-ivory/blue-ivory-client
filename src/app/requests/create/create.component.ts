import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { CreateRequestDialogComponent } from './dialog/dialog.component';


@Component({
  selector: 'app-request-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateRequestComponent {

  constructor(private dialog: MdDialog) { }

  openDialog() {
    let dialogRef = this.dialog.open(CreateRequestDialogComponent, { width: '700px', disableClose: true });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
