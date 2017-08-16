import { IntroductionComponent } from './introduction.component';
import { IntroductionRoutingModule } from './introduction-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionDialogComponent } from './dialog/dialog.component';
import { SharedModule } from "app/shared";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    IntroductionRoutingModule,
  ],
  exports: [
    IntroductionDialogComponent,
    IntroductionComponent,
  ],
  declarations: [
    IntroductionDialogComponent,
    IntroductionComponent
  ],
  entryComponents: [
    IntroductionDialogComponent
  ]
})
export class IntroductionModule { }
