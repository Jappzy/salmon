import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPostsPage } from './user-posts.page';

const routes: Routes = [
  {
    path: ':id',
    component: UserPostsPage
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPostsPageRoutingModule {}
