import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary-color">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Angular Blog</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/" routerLinkActive="active" 
                [routerLinkActiveOptions]="{exact: true}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/posts" routerLinkActive="active">Articles</a>
            </li>
            <li class="nav-item" *ngIf="currentUser">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!currentUser">
              <a class="nav-link" routerLink="/login" routerLinkActive="active">Login</a>
            </li>
            <li class="nav-item dropdown" *ngIf="currentUser">
              <a class="nav-link dropdown-toggle" id="userDropdown" role="button" 
                data-bs-toggle="dropdown" aria-expanded="false">
                Welcome, {{ currentUser.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" routerLink="/dashboard">Dashboard</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" (click)="logout()">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: 600;
    }
    .nav-link {
      cursor: pointer;
    }
    .dropdown-item {
      cursor: pointer;
    }
    .active {
      font-weight: 500;
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
}