import { Injectable } from "@nestjs/common";
import { TagsDocument } from "../tags/schemas/tags.schema";
import { IBulkWriteTag } from "./theme.interfaces";
import { TagsRepository } from "src/tags/tags.repository";
import { ObjectId } from "mongoose";
import { ThemeRepository } from "./theme.repository";

@Injectable()
export class ThemeService {
    constructor(private readonly tagsRepository: TagsRepository,
                private readonly themeRepository: ThemeRepository) {}

    prepareTagsForCreation(names: string[]) {
        return names.map(name => {
            return {
                insertOne: {
                    document: {
                        "name": name
                    }
                }
            };
        })
    }

    excludeExistingTags(existingTags: TagsDocument[], allTags: string[]) {
        return allTags.filter(tag => {
            for(const existingTag of existingTags)
                if(existingTag.name === tag)
                    return false;
            return true;
        });
    }

    getIdsFromTags(tags: TagsDocument[]): ObjectId[] {
        return tags.map(tag => {
            return tag._id;
        });
    }

    async createTagsByNames(names: IBulkWriteTag[]): Promise<ObjectId[]> {
        const tags = await this.tagsRepository.createTagsByNames(names);
        return tags.result.insertedIds.map(item => {
            return item._id;
        });
    }

    async addTagsToTheme(themeId: ObjectId, tagIds: ObjectId[]) {
        const bulkData = tagIds.map(tagId => {
            return {
                insertOne: {
                    document: {
                        themeId,
                        tagId: tagId
                    }
                }
            }
        });
        return this.themeRepository.createThemeTags(bulkData);
    }
}