import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Step 1: Validate User for Login
   * This is called by the Passport Local Strategy
   */
  async validateUser(username: string, pass: string): Promise<any> {
    // 1. Search for the user in MongoDB by their unique username
    const user = await this.userModel.findOne({ username }).exec();

    // 2. If user exists, compare the typed password with the hashed one in DB
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        // 3. Success! Strip the password out before returning the user object
        // We use .toObject() because Mongoose returns a complex document
        const { password, ...result } = user.toObject();
        return result;
      }
    }

    // 4. Return null if password fails or user is not found
    return null;
  }

  /**
   * Step 2: Generate JWT
   * This is called after validateUser succeeds
   */
  async login(user: any) {
    // 'user' here is the 'result' object from validateUser above
    const payload = {
      username: user.username,
      sub: user._id, // Use the MongoDB _id as the 'subject'
      role: user.role, // This role now comes directly from your DB!
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(username: string, pass: string, role: string) {
    // 1. Check if user exists
    const existingUser = await this.userModel.findOne({ username }).exec();
    if (existingUser) {
      // Better to use NestJS built-in exception for a clean 409 response
      throw new ConflictException('Username already exists');
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);

    // 3. Create and Save (Done in one step)
    await this.userModel.create({
      username,
      password: hashedPassword,
      role,
    });

    return { message: 'User registered successfully' };
  }
}
