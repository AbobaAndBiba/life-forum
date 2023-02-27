import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { IsLogedInGuard } from "../guards/is-loged-in.guard";
import { CreateThemeDto } from "./dto/create-theme.dto";
import { createThemeMapper } from "./mapper/create-theme.mapper";
import { ThemeRepository } from "./theme.repository";
import { Request } from 'express';
import { UserRepository } from "../user/user.repository";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { updateThemeMapper } from "./mapper/update-theme.mapper";
import { ToNumberPipe } from "../pipes/to-number.pipe";
import { getThemesMapper } from "./mapper/get-themes.mapper";
import { GetAllThemesFrontType } from "./theme.types";
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/role.type";
import { ValidateMongooseIdPipe } from "src/pipes/validate-monoose-id.pipe";
import { TagsRepository } from "src/tags/tags.repository";
import { ThemeService } from "./theme.service";
import { ObjectId } from "mongoose";

@Controller("theme")
export class ThemeController {
    constructor(private readonly themeRepository: ThemeRepository,
                private readonly themeService: ThemeService,
                private readonly userRepository: UserRepository,
                private readonly roleRepository: RoleRepository,
                private readonly tagsRepository: TagsRepository) {}

    @Get('/get/all')
    async getAllThemes(@Query('limit', ToNumberPipe) limitQ: number = 9, @Query('offset', ToNumberPipe) offsetQ: number = 0): Promise<GetAllThemesFrontType> {
        const { limit, offset } = getThemesMapper.fromControllerToService(limitQ, offsetQ);
        const themes = await this.themeRepository.getAllThemesFront(limit, offset);
        const total = (await this.themeRepository.getAllThemes()).length;
        return {
            total,
            limit,
            offset,
            themes
        };
    }

    @UseGuards(IsLogedInGuard)
    @Post('/create')
    async createTheme(@Body() dto: CreateThemeDto, @Req() req: Request) {
        dto = createThemeMapper.fromFrontToController(dto);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const theme = await this.themeRepository.getThemeByTitle(dto.title);
        if(theme)
            throw new HttpException('The theme with this title is already in use', 400);
        const existingTags = await this.tagsRepository.getTagsByNames(dto.tags);
        const newTags = this.themeService.excludeExistingTags(existingTags, dto.tags);
        const tagsForCreation = this.themeService.prepareTagsForCreation(newTags);
        const newCreatedTags = await this.themeService.createTagsByNames(tagsForCreation);
        const existingTagsIds = this.themeService.getIdsFromTags(existingTags);
        const newTheme = await this.themeRepository.createTheme({ ...dto, createdBy: user.id });
        await this.themeService.addTagsToTheme(newTheme._id, [...newCreatedTags, ...existingTagsIds]);
        return newTheme;
    }

    @UseGuards(IsLogedInGuard)
    @Patch('/update/:themeId')
    async updateTheme(@Body() dto: UpdateThemeDto, @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId): Promise<Object> {
        if(!themeId)
            throw new HttpException('Incorrect id type', 400);
        dto = updateThemeMapper.fromFrontToController(dto);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        if(dto.title) {
            const checkTitleUnique = await this.themeRepository.getThemeByTitle(dto.title);
            if(checkTitleUnique)
                throw new HttpException('The theme with this title is already in use', 400);
        }
        await this.themeRepository.updateThemeById(theme.id, dto);
        return { message: 'The theme has been updated successfully.' };
    }

    @UseGuards(IsLogedInGuard)
    @Delete('/delete/:themeId')
    async deleteTheme(@Param('themeId') themeId: ObjectId, @Req() req: Request): Promise<Object> {
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        const role = await this.roleRepository.getRoleById(user.roleId);
        if(!role)
            throw new NotFoundException("The role was not found");
        if(theme.createdBy !== user.id && role.name !== RoleType.Admin)
            throw new HttpException("You don't have a permission to do this action", 403);
        await this.themeRepository.deleteThemeById(theme.id);
        return { message: 'The theme has been deleted successfully.' };
    }
}