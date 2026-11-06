import { pool } from '../config/db';
import { User, CreateUserDTO } from '../types/user.types';

export class UserRepository {
  
  // 1. Create a new user
  async create(user: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;
    const values = [user.name, user.email, user.password_hash, user.phone, user.role];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // 2. Find user by email (used for login & duplicate check)
  async findByEmail(email: string): Promise<User | null> {
    // Notice we select EVERYTHING here, including the password_hash
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // 3. Find user by ID (used for profiling)
  async findById(id: string): Promise<User | null> {
    // Notice we EXCLUDE password_hash here for security!
    const query = `
      SELECT id, name, email, phone, role, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

export const userRepository = new UserRepository();