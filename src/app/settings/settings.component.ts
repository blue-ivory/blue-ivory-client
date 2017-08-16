import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { SettingsDialogComponent } from 'app/settings/dialog/dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  openDialog() {
    let dialogRef = this.dialog.open(SettingsDialogComponent, { disableClose: false, width: '400px' });
  }

}
