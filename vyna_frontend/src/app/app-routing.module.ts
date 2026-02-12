import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WildcardComponent } from './wildcard/wildcard.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: 'page-not-found',
    component: WildcardComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  }
];


@NgModule({
    imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
