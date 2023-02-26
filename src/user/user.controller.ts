import { Body, Controller, Get, HttpException, NotFoundException, Post, Req, UseGuards} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { createUserMapper } from "./mappers/create-user.mapper.dto";
import * as bcryptjs from "bcryptjs";
import { RoleType } from "../role/role.type";
import { RoleService } from "../role/role.service";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { loginMapper } from "./mappers/login.mapper";
import { IsLogedInGuard } from "../guards/is-loged-in.guard";
import { Request } from 'express';

@Controller("user")
export class UserController {
    constructor(private readonly userRepository: UserRepository,
                private readonly userService: UserService,
                private readonly roleService: RoleService) {}

    @UseGuards(IsLogedInGuard)
    @Get('/auth')
    async auth(@Req() req: Request) {
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const token = this.userService.generateToken(user);
        return { token };
    }

    @Post('/register')
    async registration(@Body() dto: CreateUserDto): Promise<Object> {
        dto = createUserMapper.fromFrontToController(dto);
        const user = await this.userRepository.getUserByEmail(dto.email);
        if(user)
            throw new HttpException('This email is already in use', 400);
        const userRole = await this.roleService.getRoleByName(RoleType.User);
        if(!userRole)
            throw new NotFoundException('The user role was not found');
        const hashPassword = await bcryptjs.hash(dto.password!, 5);
        const newUser = await this.userRepository.createUser({...dto, password: hashPassword, roleId: userRole.id})
        const token = this.userService.generateToken(newUser);
        return { token };
    }

    @Post('/login')
    async login(@Body() dto: LoginDto): Promise<Object> {
        dto = loginMapper.fromFrontToController(dto);
        const user = await this.userRepository.getUserByEmail(dto.email);
        if(!user)
            throw new HttpException('Incorrect data', 400);
        const comparePasswords = await bcryptjs.compare(dto.password, user.password);
        if(!comparePasswords)
            throw new HttpException('Incorrect data', 400);
        const token = this.userService.generateToken(user);
        return { token };
    }
}