import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) {}

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}?postId=${postId}`);
  }

  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
