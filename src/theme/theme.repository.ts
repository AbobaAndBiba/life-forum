import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { ITheme, Theme, ThemeDocument } from "./schemas/theme.schema";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { IBulkWriteDeleteOneThemeTag, IBulkWriteInsertOneThemeTag, IThemeCreation } from "./theme.interfaces";
import { ThemeTag, ThemeTagDocument } from "./schemas/theme-tag.schema";

@Injectable()
export class ThemeRepository {
    constructor(@InjectModel(Theme.name) private readonly theme: Model<ThemeDocument>,
        @InjectModel(ThemeTag.name) private readonly themeTag: Model<ThemeTagDocument>) { }

    async createTheme(data: IThemeCreation) {
        return this.theme.create(data);
    }

    async getAllThemes(): Promise<ITheme[]> {
        return this.theme.find();
    }

    async getAllThemesFront(limit: number, offset: number): Promise<ITheme[]> {
        return this.theme.find().skip(offset).limit(limit);
    }

    async getThemeById(id: ObjectId): Promise<ThemeDocument> {
        return this.theme.findOne({ _id: id });
    }

    async getThemeByIdFront(id: string): Promise<any> {
        return this.theme.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                }
            },
            {
                '$lookup': {
                  'from': 'comments', 
                  'localField': '_id', 
                  'foreignField': 'themeId', 
                  'as': 'comments'
                }
              }, {
                '$unwind': {
                  'path': '$comments'
                }
              }, {
                '$lookup': {
                  'from': 'users', 
                  'localField': 'comments.createdBy', 
                  'foreignField': '_id', 
                  'as': 'user'
                }
              }, {
                '$project': {
                  'title': 1, 
                  'body': 1, 
                  'createdBy': 1, 
                  'createdAt': 1, 
                  'updatedAt': 1, 
                  'comment': '$comments', 
                  'user': '$user'
                }
              }, {
                '$unwind': {
                  'path': '$user'
                }
              }, {
                '$addFields': {
                  'comment': {
                    '$mergeObjects': [
                      '$comment', {
                        'user': '$user'
                      }
                    ]
                  }
                }
              }, {
                '$unset': 'user'
              }, {
                '$group': {
                  '_id': '$_id', 
                  'title': {
                    '$first': '$title'
                  }, 
                  'body': {
                    '$first': '$body'
                  }, 
                  'createdBy': {
                    '$first': '$createdBy'
                  }, 
                  'createdAt': {
                    '$first': '$createdAt'
                  }, 
                  'updatedAt': {
                    '$first': '$updatedAt'
                  }, 
                  'comments': {
                    '$push': '$comment'
                  }
                }
              }, {
                '$project': {
                  'comments.user.password': 0, 
                  'comments.user.roleId': 0
                }
            }
        ]);
    }

    async getThemeByTitle(title: string): Promise<ThemeDocument> {
        return this.theme.findOne({ title });
    }

    async deleteThemeById(id: ObjectId) {
        await this.theme.deleteOne({ _id: id });
    }

    async updateThemeById(id: ObjectId, dto: UpdateThemeDto) {
        return this.theme.updateOne({ _id: id }, dto);
    }

    async createThemeTags(data: IBulkWriteInsertOneThemeTag[]) {
        return this.themeTag.bulkWrite(data);
    }

    async deleteThemeTags(data: IBulkWriteDeleteOneThemeTag[]) {
        return this.themeTag.bulkWrite(data);
    }

    async getThemeTagsByThemeId(themeId: ObjectId): Promise<ThemeTagDocument[]> {
        return this.themeTag.find({ themeId });
    }

    async getThemeTagsByThemeIdAndTagIds(themeId: ObjectId, tagsIds: ObjectId[]): Promise<ThemeTagDocument[]> {
        return this.themeTag.find({
            themeId,
            tagId: {
                "$in": tagsIds
            }
        });
    }

    async deleteThemeTagsByThemeId(themeId: ObjectId) {
        await this.themeTag.deleteMany({ themeId });
    }

    async deleteThemeTagsByTagId(tagId: ObjectId) {
        await this.themeTag.deleteMany({ tagId });
    }
}