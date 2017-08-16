import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersGuard } from '../guards/users.guard';


const routes: Routes = [
    {
        path: 'users', canActivate: [AuthGuard, UsersGuard], children: [
            { path: ':searchTerm', component: UsersComponent },
            { path: '', component: UsersComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UsersRoutingModule { }