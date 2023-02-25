import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { ITags, Tags, TagsDocument } from "./schemas/tags.schema";

@Injectable()
export class TagsRepository {
    constructor(
        @InjectModel(Tags.name) private readonly tags: Model<TagsDocument>
    ) {}

    async createTag(data:CreateTagDto){
        return this.tags.create(data);
    } 

    async getAllTags(): Promise<ITags[]>{
        return this.tags.find();
    }

    async getTagByName(tagName: string): Promise<ITags>{
        return this.tags.findOne({name: tagName});
    }

    async deleteTagByName(tagName: string){
        await this.tags.deleteOne({name: tagName});
    }

    async updateTagByName(tagName: string,dto: UpdateTagDto){
        return this.tags.updateOne({name: tagName},dto);
    }
}