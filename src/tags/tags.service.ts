import { Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { ITags } from "./schemas/tags.schema";
import { TagsRepository } from "./tags.repository";

@Injectable()
export class TagsService {
    constructor(
        private readonly tagsRepository: TagsRepository
    ) {}

    async createTag(newTag:CreateTagDto){
       await this.tagsRepository.createTag(newTag); 
    }

    async getAllTags(): Promise<string[]>{
        return (await (this.tagsRepository.getAllTags())).map( tag => {
            return tag.name;
        } );
    }

    async getTagByName(tagName: string): Promise<string>{
        return (await (this.tagsRepository.getTagByName(tagName))).name;
    }

    async deleteTagByName(tagName: string){
         (await (this.tagsRepository.deleteTagByName(tagName)));
    }

    async updateTagByName(tagName: string,dto: UpdateTagDto){
        return this.tagsRepository.updateTagByName(tagName,dto);
    }
}