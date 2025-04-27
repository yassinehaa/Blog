import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import {map, take} from "rxjs";
import {CommentSectionComponent} from '../../components/comment-section/comment-section.component';
import {ArticlesService} from '../../services/articles-service.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentSectionComponent],
  template: `

    <div class="container page-container fade-in" *ngIf="post">
      <!-- Back button -->
      <div class="row mb-4">
        <div class="col-md-12">
          <button class="btn btn-outline-primary" (click)="goBack()">
            &larr; Back to Articles
          </button>
        </div>
      </div>

      {{post|json}}

      <!-- Article Header -->
      <div class="row mb-4">
        <div class="col-md-8">
          <span class="category-badge mb-2">{{ post.category }}</span>
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <span>By {{  post.author}}</span>]
            <span class="mx-2">·</span>
            <span>{{  post.createdAt | date:'medium' }}</span>
            <span class="mx-2" *ngIf="post.updatedAt !==  post.createdAt">·</span>
            <span *ngIf=" post.updatedAt !== post.createdAt">
              Updated: {{  post.updatedAt | date:'medium' }}
            </span>
          </div>
        </div>
        <div class="col-md-4 text-end" *ngIf="canEdit">
          <button class="btn btn-outline-primary me-2" [routerLink]="['/posts/edit',  post.id]">
            Edit
          </button>
          <button class="btn btn-outline-danger" (click)="deletePost()">
            Delete
          </button>
        </div>
      </div>

      <!-- Featured Image -->
      <div class="row mb-4">
        <div class="col-md-12">
          <img [src]=" post.imageUrl" class="img-fluid featured-image" [alt]=" post.title">
        </div>
      </div>

      <!-- Article Content -->
      <div class="row mb-5">
        <div class="col-md-12">
          <div class="post-content">
            <!-- Replace this with a safer HTML rendering if needed -->
            <p>{{ post.content }}</p>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <app-comment-section [postId]=" post.id"></app-comment-section>
    </div>

    <!-- Loading state -->
    <div class="container page-container" *ngIf="!post">
      <div class="row">
        <div class="col-md-12 text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading article...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .post-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .post-meta {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    .featured-image {
      width: 100%;
      max-height: 500px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .post-content {
      font-size: 1.1rem;
      line-height: 1.7;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  post: any | null = null;
  currentUser: User | null = null;
  canEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: ArticlesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPost();

    this.authService.currentUser$.subscribe(user => {

      this.currentUser = user;
      this.updateEditPermissions();
    });
  }

  loadPost(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.postService.getPostById(id).
      subscribe(post => {
        console.log(post);
        this.post = post;
        this.updateEditPermissions();
      });
    }
  }

  updateEditPermissions(): void {
    if (this.post && this.currentUser) {
      this.canEdit = this.post.authorId === this.currentUser.id ||
        this.currentUser.role === 'admin';
    } else {
      this.canEdit = false;
    }
  }

  deletePost(): void {
    if (this.post && confirm('Are you sure you want to delete this article?')) {
      this.postService.deletePost(this.post.id).subscribe(() => {
        this.router.navigate(['/posts']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}
