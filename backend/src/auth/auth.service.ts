import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        // Here you would
        // 1. Fetch the user from the database using the username
        // 2. Compare the provided password with the stored hashed password
        // For simplicity, let's assume we have a hardcoded user
        const user = { userId: 1, username: 'testuser', password: 'testpass' };
        if (user && user.username === username && user.password === password) {
            const { userId, username, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}