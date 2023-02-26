import { ObjectId } from "mongoose";

export interface IThemeCreation {
    title: string;
    body: string;
    createdBy: ObjectId;
}

export interface IBulkWriteTag {
    insertOne: {
        document: {
            name: string
        }
    }
}

export interface IBulkWriteThemeTag {
    insertOne: {
        document: {
            themeId: ObjectId;
            tagId: ObjectId;
        }
    }
}