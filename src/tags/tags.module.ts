import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Tags, TagsSchema } from "./schemas/tags.schema";
import { TagsController } from "./tags.controller";
import { TagsRepository } from "./tags.repository";
import { TagsService } from "./tags.service";
import { UserModule } from "src/user/user.module";
import { RoleModule } from "src/role/role.module";

const tagsFeature = MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }])

@Module({
  imports: [
    tagsFeature,
    UserModule,
    RoleModule
  ],
  controllers: [TagsController],
  providers: [
    TagsService,
    TagsRepository
  ],
  exports: [
    TagsService,
    TagsRepository
  ]
})
export class TagsModule {} 