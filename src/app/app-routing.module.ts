import { IntroductionComponent } from './introduction/introduction.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards';

export const routes: Routes = [
  { path: 'search', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/requests/all' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }