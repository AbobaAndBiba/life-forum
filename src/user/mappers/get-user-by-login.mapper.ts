import { UserDocument } from "../schemas/user.schema";
import { IUserFront } from "../user.interfaces";

class GetUserByLoginMapper {
    fromControllerToFront(user: UserDocument): IUserFront {
        return {
            user: {
                login: user.login
            }
        }
    }
}
export const getUserByLoginMapper = new GetUserByLoginMapper;