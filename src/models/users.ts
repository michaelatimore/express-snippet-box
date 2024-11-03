import type pg from 'pg';
import bcrypt from "bcrypt";


type UserModel = {
  email: string, 
  firstName: string, 
  lastName: string, 
  password: string
};

export class Users {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }  

  async createUser(email: string, firstName: string, lastName: string, password: string) {
    try {
      if (!email) {
        throw new Error("Email is missing");
      }
      const emailRx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
      if (!email.match(emailRx)) {
        throw new Error("Invalid email format");
      }
      if (!firstName) {
        throw new Error("First name is missing");
      }
      if (!lastName) {
        throw new Error("Last name is missing");
      }
      if (!password) {
        throw new Error("Password is missing");
      }     

      if (password.length < 8) {
        throw new Error("Minimum password length is 8 characters");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      
      const newUser = await this.pool.query(
        "INSERT INTO users (email, first_name, last_name, password, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [email, firstName, lastName, passwordHash, false]
      );
      return newUser.rows[0];
    } catch (err) {
      console.error("Failed to create user: ", err);
    }
  }
}  
