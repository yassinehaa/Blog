import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import {ArticlesService} from '../../services/articles-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container page-container fade-in">
      <div class="row mb-4">
        <div class="col-md-8">
          <h1 class="page-title">Dashboard</h1>
          <p class="lead">Welcome back, {{ currentUser?.name }}</p>
        </div>
        <div class="col-md-4 text-end">
          <a routerLink="/posts/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i> New Article
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="card bg-primary-color text-white">
            <div class="card-body">
              <h5 class="card-title">Total Articles</h5>
              <p class="card-text display-4">{{ userPosts.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- User Articles -->
      <div class="row mb-4">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header bg-light">
              <h3 class="mb-0">Your Articles</h3>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let post of userPosts">
                      <td>{{ post.title }}</td>
                      <td><span class="category-badge">{{ post.category }}</span></td>
                      <td>{{ post.createdAt | date:'short' }}</td>
                      <td>{{ post.updatedAt | date:'short' }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <a [routerLink]="['/posts', post.id]" class="btn btn-outline-primary">View</a>
                          <a [routerLink]="['/posts/edit', post.id]" class="btn btn-outline-secondary">Edit</a>
                          <button (click)="deletePost(post.id)" class="btn btn-outline-danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                    <tr *ngIf="userPosts.length === 0">
                      <td colspan="5" class="text-center p-3">
                        You haven't created any articles yet.
                        <a routerLink="/posts/new">Create your first article</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lead {
      font-size: 1.25rem;
    }
    .category-badge {
      font-size: 0.75rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userPosts: Post[] = [];

  constructor(
    private postService: ArticlesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserPosts();
      }
    });
  }

  loadUserPosts(): void {
    if (!this.currentUser) {
      return;
    }

    this.postService.getPosts().subscribe(posts => {

      this.userPosts = posts.filter(post => post.authorId === this.currentUser?.id);
    });
  }

  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this article?')) {
      this.postService.deletePost(id).subscribe(() => {
        this.loadUserPosts();
      });
    }
  }
}
