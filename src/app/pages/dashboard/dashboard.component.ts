import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../services/auth.service';  // Import Router to navigate after logout
// Import AuthService to handle logout

@Component({
  selector: 'app-dashboard',
  standalone: true,  // Standalone component
  templateUrl: './dashboard.component.html',  // Template for the component
  styleUrls: ['./dashboard.component.css'],  // Style for the component
  imports: [],  // Empty imports array if you're using standalone components in Angular
})
export class DashboardComponent {

  constructor(private authService:AuthService, private router: Router) {}

  // Method to handle logout
  logout() {
    this.authService.logout();  // Clear the user's token and admin status from localStorage
    this.router.navigate(['/login']);  // Redirect the user to the login page after logout
  }
}
