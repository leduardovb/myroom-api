import { PrismaClient } from '@prisma/client';
import { LoginDTO } from '../dtos/LoginDTO';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Token } from '../interfaces/Token';

export default class AuthenticationService {
  constructor(database: PrismaClient) {}

  public async login(dto: LoginDTO) {
    return null;
  }

  public static async hashPassword(password: string, salt = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(hashedPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static decodeToken(token: string) {
    return jwt.verify(token, process.env.AUTHENTICATION_KEY!) as Token;
  }
}
