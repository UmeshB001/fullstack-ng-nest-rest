import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }), // Configure the JwtModule with a secret key and token expiration time
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), // Register the User schema with Mongoose so we can interact with the users collection in MongoDB
  ],
  providers: [AuthService, JwtStrategy], // Register the JwtStrategy as a provider so it can be used for authentication
  exports: [AuthService], // Export AuthService so it can be injected into other modules (e.g., TasksModule for role-based access control)
  controllers: [AuthController], // Register the AuthController to handle authentication-related routes (e.g., /auth/login, /auth/register)
})
export class AuthModule {}
