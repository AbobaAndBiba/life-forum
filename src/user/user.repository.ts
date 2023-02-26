import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose";
import { IUser, User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly user: Model<UserDocument>
    ) {}

    async createUser(data: CreateUserDto){
        return this.user.create(data);
    } 

    async getAllUser(): Promise<IUser[]>{
        return this.user.find();
    }

    async getUserByEmail(email: string): Promise<UserDocument>{
        return this.user.findOne({ email });
    }
}