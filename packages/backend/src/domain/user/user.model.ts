/**
 * Modelo de entidad User (Usuario)
 */

export interface UserModel {
  id: string;
  username: string;
  email: string;
  password_hash?: string;
  role: 'admin' | 'manager' | 'technician' | 'viewer';
  department?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password_hash?: string;
  role?: 'admin' | 'manager' | 'technician' | 'viewer';
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password_hash?: string;
  role?: 'admin' | 'manager' | 'technician' | 'viewer';
  department?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export type UserRole = 'admin' | 'manager' | 'technician' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'suspended';