import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WildcardComponent } from './wildcard/wildcard.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  
 
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((res) => res.AuthModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
   canActivate: [AuthGuard] // Ensure AuthGuard isn't blocking access
  },

  {
    path: 'page-not-found',
    component: WildcardComponent
  },
  {
    path: '**',
    redirectTo: 'page-not-found' // Wildcard to catch undefined routes
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
