import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class Auth {
  id: string;
  username: string;
  password: string;

  constructor(id: string, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  /**
   * Validates the password using bcrypt.
   * @param inputPassword - The password provided by the user.
   * @returns A promise that resolves to true if valid, false otherwise.
   */
  async validatePassword(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
  }

  /**
   * Generates a JWT token for authentication.
   * @returns A signed JWT token.
   */
  generateToken(): string {
    return jwt.sign({ deviceId: this.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  }

  /**
   * Renews an authentication token.
   * @returns A new JWT token.
   */
  static renewToken(deviceId: string): string {
    return jwt.sign({ deviceId }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  }
}
