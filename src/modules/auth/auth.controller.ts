/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('hello')
  hello() {
    return 'Hello from Auth API';
  }

  @Post('signup')
  async signup(
    @Body() body: { 
      email: string; 
      password: string; 
      role: 'RECRUITER' | 'JOB_APPLICANT'; 
      companyName?: string; 
    }
  ) {
    return this.authService.signup(body.email, body.password, body.role, body.companyName);
  }

  @Post('signin')
  async login(
    @Body() body: { email: string; password: string; }
  ) {
    return this.authService.login(body.email, body.password);
  }
}
