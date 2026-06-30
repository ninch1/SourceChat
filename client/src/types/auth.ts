export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

export interface RegisterUserData {
  email: string;
  username: string;
  password: string;
}
