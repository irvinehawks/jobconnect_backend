/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async signup(email: string, password: string, role: 'RECRUITER' | 'JOB_APPLICANT', companyName?: string) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the specified role
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // If the user is a recruiter, create a company
    if (role === 'RECRUITER' && companyName) {
      await this.prisma.company.create({
        data: {
          name: companyName,
          ownerId: user.id,
        },
      });
    }

    // Generate a token
    const token = this.generateToken(user.id);

    return { token, user };
  }

  async login(email: string, password: string) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Validate user existence and password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // Generate a token
    const token = this.generateToken(user.id);

    return { token, user };
  }

  private generateToken(userId: number) {
    return this.jwtService.sign({ userId });
  }
}