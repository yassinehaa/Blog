import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './guard/auth.guard';


export const routes: Routes = [

  { path: 'login', component: LoginComponent }, // Login page route
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Dashboard route with guard
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route, redirects to login

];
