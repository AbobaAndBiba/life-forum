import { CreateUserDto } from "../dto/create-user.dto";
import { UserDocument } from "../schemas/user.schema";
import { ITokenAndUserFront } from "../user.interfaces";

class CreateUserMapper {
    fromFrontToController(dto: CreateUserDto): CreateUserDto{
        return {
            email: dto.email,
            login: dto.login,
            password: dto.password,
            roleId: dto.roleId
        }
    }

    fromControllerToFront(token: string, user: UserDocument): ITokenAndUserFront {
        return {
            token,
            user: {
                login: user.login
            }
        }
    }
}
export const createUserMapper = new CreateUserMapper;