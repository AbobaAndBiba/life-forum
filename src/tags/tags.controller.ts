import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { createTagMapper } from "./mappers/create-tag.mapper";
import { updateTagMapper } from "./mappers/update-tag.mapper";
import { TagsRepository } from "./tags.repository";
import { TagsService } from "./tags.service";
import { Roles } from "src/decorators/roles.decorator";
import { RoleType } from "src/role/role.type";
import { IsBannedGuard } from "src/guards/is-banned.guard";
import { RolesGuard } from "src/guards/roles.guard";

@Controller("tags")
export class TagsController {
    
    constructor(
        private readonly tagsService: TagsService,
        private readonly tagsRepository: TagsRepository
    ) {}
    
    @Get(":name")
    async getTagByName(@Param("name") tagName: string){
        return this.tagsService.getTagByName(tagName); 
    }

    @Roles([RoleType.Admin])
    @UseGuards(RolesGuard)
    @UseGuards(IsBannedGuard)
    @Post("/create")
    async createTag(@Body() dto:CreateTagDto){
        dto = createTagMapper.fromFrontToController(dto);
        const tag = await this.tagsRepository.getTagByName(dto.name);
        if(tag)
            throw new HttpException("Tag with such name already exists",400);
        return this.tagsService.createTag(dto);
    }

    @Get("/get/all")
    async getTag(){
        return this.tagsService.getAllTags(); 
    }

    @Roles([RoleType.Admin])
    @UseGuards(RolesGuard)
    @UseGuards(IsBannedGuard)
    @Delete(":name")
    async deleteTagByName(@Param("name") tagName: string){
        const tag = await this.tagsRepository.getTagByName(tagName);
        if(!tag)
            throw new NotFoundException("Tag was not found");
        await this.tagsService.deleteTagByName(tag.name);
        return {message: "The tag has been deleted successfully"};
    }

    @Roles([RoleType.Admin])
    @UseGuards(RolesGuard)
    @UseGuards(IsBannedGuard)
    @Patch(":name")
    async updateTagByName(@Param("name") tagName: string ,@Body() dto:UpdateTagDto){
        dto = updateTagMapper.fromFrontToController(dto);
        const tag = await this.tagsRepository.getTagByName(tagName);
        if(!tag)
            throw new NotFoundException("Tag was not found");
        const checkTagUnique = await this.tagsRepository.getTagByName(dto.name);
        if(checkTagUnique)
            throw new HttpException("Tag with such name already exists",400);
        await this.tagsRepository.updateTagByName(tagName,dto);
        return {message: "The tag has been updated successfully"};
    }
    
}