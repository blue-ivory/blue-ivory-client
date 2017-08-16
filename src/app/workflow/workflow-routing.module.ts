import { WorkflowDetailsComponent } from './details/details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { AuthGuard } from '../guards/auth.guard';
import { WorkflowGuard } from '../guards/workflow.guard';


const routes: Routes = [
    {
        path: 'workflow', canActivate: [AuthGuard, WorkflowGuard], children: [
            { path: ':organizationId', component: WorkflowDetailsComponent },
            { path: '', component: WorkflowComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkflowRoutingModule { }