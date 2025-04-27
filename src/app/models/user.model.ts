
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
}