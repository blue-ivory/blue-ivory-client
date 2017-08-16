import { NgModule, Directive } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule, MdDatepickerModule, MdNativeDateModule } from '@angular/material';
import {
  CovalentLayoutModule,
  CovalentStepsModule,
  CovalentDialogsModule,
  CovalentPagingModule,
  CovalentNotificationsModule
} from '@covalent/core';
import { I18nPipe, I18nService } from 'angular2-i18n';
import { ClickOutsideDirective } from 'ng-click-outside';

import { DroppableDirective } from './draggable/droppable.directive';
import { DraggableDirective } from './draggable/draggable.directive';
import { SpecialCharacterMaskDirective } from './special-character-mask.directive';

import i18n_translation from '../i18n_translation';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentNotificationsModule,
    CovalentDialogsModule,
    CovalentStepsModule,
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MdDatepickerModule,
    MdNativeDateModule,
    FlexLayoutModule,
    CovalentLayoutModule,
    CovalentPagingModule,
    CovalentStepsModule,
    CovalentNotificationsModule,
    CovalentDialogsModule,
    ClickOutsideDirective,
    DraggableDirective,
    DroppableDirective,
    SpecialCharacterMaskDirective,
    PaginationComponent,

    I18nPipe
  ],
  declarations: [
    I18nPipe,
    ClickOutsideDirective,
    DraggableDirective,
    DroppableDirective,
    SpecialCharacterMaskDirective,
    PaginationComponent
  ],
  providers: [
    I18nService,
  ]
})
export class SharedModule {
  constructor(i18nService: I18nService) {
    i18nService.init(i18n_translation);
  }
}
