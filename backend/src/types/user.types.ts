export type UserRole = 'buyer' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

// Used when creating a new user
export type CreateUserDTO = Omit<User, 'id' | 'created_at' | 'updated_at'>;