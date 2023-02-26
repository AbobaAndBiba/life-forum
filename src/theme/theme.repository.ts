import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import { ITheme, Theme, ThemeDocument } from "./schemas/theme.schema";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { IBulkWriteThemeTag, IThemeCreation } from "./theme.interfaces";
import { ThemeTag, ThemeTagDocument } from "./schemas/theme-tag.schema";

@Injectable()
export class ThemeRepository {
    constructor(@InjectModel(Theme.name) private readonly theme: Model<ThemeDocument>,
                @InjectModel(ThemeTag.name) private readonly themeTag: Model<ThemeTagDocument>) {}

    async createTheme(data: IThemeCreation){
        return this.theme.create(data);
    } 

    async createThemeTags(data: IBulkWriteThemeTag[]) {
        return this.themeTag.bulkWrite(data);
    }

    async getAllThemes(): Promise<ITheme[]>{
        return this.theme.find();
    }

    async getAllThemesFront(limit: number, offset: number): Promise<ITheme[]>{
        return this.theme.find().skip(offset).limit(limit);
    }

    async getThemeById(id: string): Promise<ThemeDocument>{
        return this.theme.findOne({_id: id});
    }

    async getThemeByTitle(title: string): Promise<ThemeDocument>{
        return this.theme.findOne({title});
    }

    async deleteThemeById(id: ObjectId){
        await this.theme.deleteOne({_id: id});
    }

    async updateThemeById(id: ObjectId, dto: UpdateThemeDto){
        return this.theme.updateOne({_id: id}, dto);
    }
}