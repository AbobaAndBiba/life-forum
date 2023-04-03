import { UserDocument } from "../schemas/user.schema";
import { ITokenAndUserFront } from "../user.interfaces";

class AuthMapper {
    fromControllerToFront(token: string, user: UserDocument): ITokenAndUserFront {
        return {
            token,
            user: {
                login: user.login
            }
        }
    }
}
export const authMapper = new AuthMapper;