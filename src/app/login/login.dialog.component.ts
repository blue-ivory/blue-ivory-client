import { Component, OnInit, Optional } from '@angular/core';
import { MdDialog, MdDialogRef } from "@angular/material";

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login.dialog.component.html'
})
export class LoginDialogComponent {


  constructor( @Optional() public dialogRef: MdDialogRef<LoginDialogComponent>) {
  }

}