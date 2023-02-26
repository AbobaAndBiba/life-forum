import { CreateUserDto } from "../dto/create-user.dto";

class CreateUserMapper {
    fromFrontToController(dto: CreateUserDto): CreateUserDto{
        return {
            email: dto.email,
            login: dto.login,
            password: dto.password,
            roleId: dto.roleId
        }
    }
}
export const createUserMapper = new CreateUserMapper;