import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { ArticlesService } from '../../services/articles-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ]
})
export class HomeComponent implements OnInit {
  featuredPost: Post | null = null;
  recentPosts: Post[] = [];

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.articlesService.getPosts().subscribe(posts => {
      if (posts.length > 0) {
        const sortedPosts = [...posts].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Invalid date detected:', a.createdAt, b.createdAt);
            return 0;
          }
          return dateB.getTime() - dateA.getTime();
        });
        this.featuredPost = sortedPosts[0];
        this.recentPosts = sortedPosts.slice(1, 4);
      } else {
        this.featuredPost = null;
        this.recentPosts = [];
      }
    });
  }
}
