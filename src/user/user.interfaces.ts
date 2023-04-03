import { ObjectId } from "mongoose";

export interface IUpdateUser {
    password?: string;
}

export interface IUpdateBan {
    unbannedAt?: Date;
}

export interface ICreateResetPassword {
    userId: ObjectId;
    token: string;
}

export interface IUserFront {
    user: {
        login: string;
    }
}

export interface ITokenAndUserFront {
    token: string;
    user: {
        login: string;
    }
}