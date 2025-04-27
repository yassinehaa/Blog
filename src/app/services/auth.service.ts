import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'auth_token';
  private readonly ADMIN_KEY = 'is_admin';

  constructor() {}

  private get isBrowser(): boolean {
    return typeof window !== 'undefined';  // Check if window object is available
  }

  login(username: string, password: string): boolean {
    if (!this.isBrowser) {
      return false; // Return false or handle this case as needed
    }

    const normalizedUsername = username.toLowerCase();
    const normalizedPassword = password.toLowerCase();

    if (normalizedUsername === 'admin' && normalizedPassword === 'adminpassword') {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      localStorage.setItem(this.ADMIN_KEY, 'true');
      return true;
    } else if (normalizedUsername === 'admin' && normalizedPassword === 'admin') {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      localStorage.setItem(this.ADMIN_KEY, 'false');
      return true;
    }
    return false;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ADMIN_KEY);
    }
  }

  isAuthenticated(): boolean {
    return this.isBrowser && !!localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.isBrowser && localStorage.getItem(this.ADMIN_KEY) === 'true';
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }
}
