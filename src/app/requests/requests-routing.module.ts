import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestsComponent } from './requests.component';
import { AuthGuard } from '../guards/auth.guard';
import { RequestsGuard } from '../guards/requests.guard';


const routes: Routes = [
    {
        path: 'requests', canActivate: [AuthGuard], canActivateChild: [RequestsGuard], children: [
            { path: ':type/:searchTerm', component: RequestsComponent },
            { path: ':type', component: RequestsComponent },
            { path: '', component: RequestsComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RequestsRoutingModule { }
