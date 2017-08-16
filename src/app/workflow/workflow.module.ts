import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { WorkflowRoutingModule } from './workflow-routing.module';

import { WorkflowComponent } from './workflow.component';

import { WorkflowService } from './workflow.service';

import { WorkflowGuard } from '../guards/workflow.guard';
import { WorkflowDetailsComponent } from './details/details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    WorkflowRoutingModule
  ],
  declarations: [
    WorkflowComponent,
    WorkflowDetailsComponent
  ],
  providers: [
    WorkflowGuard,
    WorkflowService
  ]
})
export class WorkflowModule { }
