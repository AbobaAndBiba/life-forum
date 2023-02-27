import { Injectable } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CommentRepository } from "./comment.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
    constructor(private readonly commentRepository: CommentRepository){}

    async createComment(newComment:CreateCommentDto){
        await this.commentRepository.createComment(newComment);
    }

    async getCommentsByTheme(themeId:ObjectId){
        return this.commentRepository.getAllCommentsByThemeId(themeId);
    }

    async getCommentsByThemeFront(themeId:ObjectId, offset: number, limit: number){
        return this.commentRepository.getAllCommentsByThemeIdFront(themeId, offset, limit);
    }

    async getCommentsByThemeAndByUser(themeId:ObjectId, userId:ObjectId){
        return (await(this.commentRepository.getAllCommentsByThemeIdAndUserId(themeId, userId))).map(comment=>{
            return comment.body;
        })
    }

    async getCommentsByThemeAndByUserFront(themeId:ObjectId, userId:ObjectId, offset: number, limit: number){
        return this.commentRepository.getAllCommentsByThemeIdAndUserIdFront(themeId, userId, offset, limit);
    }
}