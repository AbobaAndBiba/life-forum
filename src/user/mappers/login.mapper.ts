import { LoginDto } from "../dto/login.dto";
import { UserDocument } from "../schemas/user.schema";
import { ITokenAndUserFront } from "../user.interfaces";

class LoginMapper {
    fromFrontToController(dto: LoginDto): LoginDto{
        return {
            email: dto.email,
            password: dto.password
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
export const loginMapper = new LoginMapper;