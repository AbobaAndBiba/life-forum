import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService){}

    generateToken(user: User): string {
        const payload = {
            email: user.email,
            login: user.login
        };
        return this.jwtService.sign(payload);
    }
}