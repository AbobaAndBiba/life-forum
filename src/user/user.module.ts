import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";
import { RoleModule } from "../role/role.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";

const userFeature = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);
const jwtRegister = JwtModule.register({
  secret: process.env.JWT_SECRET || 'jwtsecret',
  signOptions: {
    expiresIn: '1h'
  }
});

@Module({
  imports: [
    userFeature,
    jwtRegister,
    RoleModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserRepository,
    UserService
  ],
  exports: [
    UserRepository,
    UserService,
    jwtRegister
  ]
})
export class UserModule {} 