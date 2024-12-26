/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  // SIGNUP LOGIC
  async signup(
    email: string,
    password: string,
    role: 'RECRUITER' | 'JOB_APPLICANT',
    companyName?: string
  ): Promise<{ token: string; userType: string; user: any }> {
    try {
      // Check if the email is already registered
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the user
      const user = await this.prisma.user.create({
        data: { email, password: hashedPassword, role },
      });

      // If the user is a recruiter, create a company
      if (role === 'RECRUITER') {
        if (!companyName) {
          throw new HttpException('Company name is required for recruiters', HttpStatus.BAD_REQUEST);
        }
        await this.prisma.company.create({
          data: { name: companyName, ownerId: user.id },
        });
      }

      // Convert bigint to number
      const userId = Number(user.id);

      // Generate a token
      const token = this.generateToken(userId, role);

      return { token, userType: role, user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // LOGIN LOGIC
  async login(email: string, password: string): Promise<{ token: string; userType: string; user: any }> {
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
      }

      // Convert bigint to number
      const userId = Number(user.id);

      // Generate a token
      const token = this.generateToken(userId, user.role);

      return { token, userType: user.role, user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private generateToken(userId: number, role: string): string {
    try {
      return this.jwtService.sign({ userId, role });
    } catch (error) {
      throw new HttpException('Token generation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}