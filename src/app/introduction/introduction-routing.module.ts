import { IntroductionComponent } from './introduction.component';
import { IntroductionDialogComponent } from './dialog/dialog.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { RequestsGuard } from '../guards/requests.guard';


const routes: Routes = [
    {
        path: 'introduction', canActivate: [], children: [
            { path: '', component: IntroductionComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class IntroductionRoutingModule { }