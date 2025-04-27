import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../../services/category.service';
import { Post } from '../../models/post.model';
import {ArticlesService} from '../../services/articles-service.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container page-container fade-in">
      <div class="row">
        <div class="col-md-12">
          <h1 class="page-title">Blog Articles</h1>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Search articles..."
                  [(ngModel)]="searchQuery" (keyup.enter)="searchPosts()">
            <button class="btn btn-primary" type="button" (click)="searchPosts()">
              Search
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-2">
            <span>Filter by:</span>
            <div class="btn-group">
              <button class="btn" [class.btn-primary]="!selectedCategory"
                      [class.btn-outline-primary]="selectedCategory"
                      (click)="filterByCategory('')">
                All
              </button>
              <button *ngFor="let category of categories" class="btn"
                      [class.btn-primary]="selectedCategory === category"
                      [class.btn-outline-primary]="selectedCategory !== category"
                      (click)="filterByCategory(category)">
                {{ category }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts List -->
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" *ngIf="posts.length > 0">
        <div class="col" *ngFor="let post of posts">
          <div class="card h-100">
            <img [src]="post.imageUrl" class="card-img-top" [alt]="post.title">
            <div class="card-body">
              <span class="category-badge mb-2">{{ post.category }}</span>
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ post.content | slice:0:100 }}...</p>
            </div>
            <div class="card-footer">
              <small class="text-muted">By {{ post.author }} on {{ post.createdAt | date:'mediumDate' }}</small>
              <a [routerLink]="['/posts', post.id]" class="btn btn-sm btn-outline-primary float-end">Read More</a>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div class="row" *ngIf="posts.length === 0">
        <div class="col-md-12">
          <div class="alert alert-info">
            No articles found. Please try a different search or filter.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  searchQuery: string = '';

  constructor(
    private postService: ArticlesService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPosts();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories.map(cat => cat.name);
    });
  }

  loadPosts(): void {
    this.postService.getPosts(this.selectedCategory, this.searchQuery).subscribe(posts => {
      this.posts = posts;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadPosts();
  }

  searchPosts(): void {
    this.loadPosts();
  }
}
