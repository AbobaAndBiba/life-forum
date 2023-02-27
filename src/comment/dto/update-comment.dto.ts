import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    body: string;
}