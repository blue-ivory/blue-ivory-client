import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsDialogComponent } from './dialog/dialog.component';
import { SharedModule } from 'app/shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    SettingsComponent,
    SettingsDialogComponent
  ],
  exports: [
    SettingsComponent
  ],
  entryComponents: [SettingsDialogComponent]
})
export class SettingsModule { }
