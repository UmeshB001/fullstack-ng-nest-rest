import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 1. Validate the user (we'll add this logic to the service next)
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 2. Return the JWT token
    return this.authService.login(user);
  }

  @Post('register') //Listens for POST requests to /auth/register
  async register(@Body() registerDto: LoginDto) {
    // For simplicity, we're using the same DTO for registration. In a real app, you'd likely have a separate RegisterDto with additional fields (e.g., email).
    // Here you would typically:
    // 1. Check if the username already exists
    // 2. Hash the password
    // 3. Save the new user to the database
    // For this example, we'll just return a success message.
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.role,
    ); // Call the register method in the AuthService to handle registration logic
  }
}
