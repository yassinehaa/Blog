import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './guard/auth.guard';
import {PostListComponent} from './pages/post-list/post-list.component';
import {PostDetailComponent} from './pages/details-article/details-article.component';



export const routes: Routes = [
  {path : 'home', component:HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: '**', redirectTo: 'home' }
];
