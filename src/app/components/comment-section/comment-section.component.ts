import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Comment } from '../../models/comment.model';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';
import {CommentService} from '../../services/comments-service.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row">
      <div class="col-md-12">
        <h3 class="mb-4">Comments</h3>

        <!-- Comment Form -->
        <div class="card mb-4" *ngIf="currentUser">
          <div class="card-body">
            <form [formGroup]="commentForm" (ngSubmit)="addComment()">
              <div class="mb-3">
                <label for="comment" class="form-label">Add a comment</label>
                <textarea
                  class="form-control"
                  id="comment"
                  rows="3"
                  formControlName="content"
                  placeholder="Share your thoughts..."></textarea>
                <div *ngIf="commentForm.get('content')?.invalid && commentForm.get('content')?.touched" class="text-danger">
                  Comment is required (minimum 2 characters)
                </div>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="commentForm.invalid">
                Post Comment
              </button>
            </form>
          </div>
        </div>

        <!-- Login prompt for anonymous users -->
        <div class="card mb-4" *ngIf="!currentUser">
          <div class="card-body text-center">
            <p>Please <a [routerLink]="['/login']" [queryParams]="{returnUrl: '/posts/' + postId}">login</a> to comment.</p>
          </div>
        </div>

        <!-- Comments list -->
        <div *ngIf="comments.length > 0" class="comments-list">
          <div class="comment" *ngFor="let comment of comments">
            <div class="d-flex justify-content-between">
              <h5 class="comment-author">{{ comment.author }}</h5>
              <button *ngIf="canDeleteComment(comment)" class="btn btn-sm btn-outline-danger"
                     (click)="deleteComment(comment.id)">
                Delete
              </button>
            </div>
            <p class="comment-date">{{ comment.createdAt | date:'medium' }}</p>
            <p>{{ comment.content }}</p>
          </div>
        </div>

        <!-- No comments yet -->
        <div *ngIf="comments.length === 0" class="no-comments text-center p-4 bg-light rounded">
          <p class="mb-0">No comments yet. Be the first to share your thoughts!</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CommentSectionComponent implements OnInit {
  @Input() postId!: number;

  commentForm: FormGroup;
  comments: Comment[] = [];
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadComments();

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByPostId(this.postId).subscribe(comments => {
      // Sort comments by date (newest first)
      this.comments = comments.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  addComment(): void {
    if (this.commentForm.invalid || !this.currentUser) {
      return;
    }

    const commentData = {
      postId: this.postId,
      userId: this.currentUser.id,
      author: this.currentUser.name,
      content: this.commentForm.value.content,
      createdAt: new Date().toISOString()
    };

    this.commentService.addComment(commentData).subscribe(() => {
      this.commentForm.reset();
      this.loadComments();
    });
  }

  deleteComment(commentId: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe(() => {
        this.loadComments();
      });
    }
  }

  canDeleteComment(comment: Comment): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Users can delete their own comments, and admins can delete any comment
    return this.currentUser.id === comment.userId || this.currentUser.role === 'admin';
  }
}
