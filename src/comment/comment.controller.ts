import {Body, Controller, Get, NotFoundException, Param, Post, Query, Req, UseGuards} from "@nestjs/common";
import { Request } from "express";
import { ObjectId } from "mongoose";
import { IsLogedInGuard } from "src/guards/is-loged-in.guard";
import { ToNumberPipe } from "src/pipes/to-number.pipe";
import { ThemeRepository } from "src/theme/theme.repository";
import { UserRepository } from "src/user/user.repository";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { createCommentMapper } from "./mapper/create-comment.mapper";
import { getCommentsMapper } from "./mapper/get-comments.mapper";

@Controller("comment")
export class CommentController{
    constructor(private readonly commentService: CommentService,
        private readonly userRepository: UserRepository,
        private readonly themeRepository: ThemeRepository){}
    
    @UseGuards(IsLogedInGuard)
    @Post('/create')
    async createComment(@Body() dto: CreateCommentDto, @Req() req: Request){
        dto = createCommentMapper.fromFrontToController(dto);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user){
            throw new NotFoundException('The user was not found.');
        }
        const theme = await this.themeRepository.getThemeById(dto.themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        return this.commentService.createComment({...dto,createdBy:user._id});
    }

    @UseGuards(IsLogedInGuard)
    @Get('/get/:themeId')
    async getAllCommentsByTheme(
        @Query('limit', ToNumberPipe) limitQ: number = 9,
        @Query('offset', ToNumberPipe) offsetQ: number = 0,
        @Param('themeId') themeId: ObjectId){
        const { limit, offset } = getCommentsMapper.fromControllerToService(limitQ, offsetQ);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        const comments = await this.commentService.getCommentsByThemeFront(themeId, offset, limit);
        const total = (await this.commentService.getCommentsByTheme(themeId)).length;
        return {
            total,
            limit,
            offset,
            comments
        };
    }

    @UseGuards(IsLogedInGuard)
    @Get('/get/user/:themeId')
    async getAllCommentsByThemeAndUser(
        @Query('limit', ToNumberPipe) limitQ: number = 9,
        @Query('offset', ToNumberPipe) offsetQ: number = 0, 
        @Param('themeId') themeId: ObjectId,
        @Req() req: Request
        ){
        const { limit, offset } = getCommentsMapper.fromControllerToService(limitQ, offsetQ);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user){
            throw new NotFoundException('The user was not found.');
        }
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        const comments = await this.commentService.getCommentsByThemeAndByUserFront(themeId, user._id, offset, limit);
        const total = (await this.commentService.getCommentsByThemeAndByUser(themeId, user._id)).length;
        return {
            total,
            limit,
            offset,
            comments
        };
    }

}