import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    {
        path: 'organizations', canActivate: [AuthGuard], children: [
            { path: ':searchTerm', component: OrganizationsComponent },
            { path: '', component: OrganizationsComponent },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrganizationsRoutingModule { }