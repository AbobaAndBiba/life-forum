import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThemeModule } from "src/theme/theme.module";
import { UserModule } from "src/user/user.module";
import { CommentController } from "./comment.controller";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";
import { Comment, CommentSchema } from "./schemas/comment.schema";

const commentFeature = MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]);

@Module({
    imports: [
        commentFeature,
        UserModule,
        ThemeModule
    ],
    controllers: [
      CommentController
    ],
    providers: [
      CommentRepository,
      CommentService
    ],
    exports: [
        CommentRepository
    ]
  })
  export class CommentModule {} 