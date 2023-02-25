import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { createRoleMapper } from "./mappers/create-role.mapper";
import { updateRoleMapper } from "./mappers/update-role.mapper";
import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";

@Controller("role")
export class RoleController {
    
    constructor(
        private readonly roleService: RoleService,
        private readonly roleRepository: RoleRepository
    ) {}
    
    @Get(":name")
    async getRoleByName(@Param("name") roleName: string){
        return this.roleService.getRoleByName(roleName); 
    }

    @Post("/create")
    async createRole(@Body() dto:CreateRoleDto){
        dto = createRoleMapper.fromFrontToController(dto);
        const role = await this.roleRepository.getRoleByName(dto.name);
        if(role)
            throw new HttpException("Role with such name already exists",400);
        return this.roleService.createRole(dto);
    }

    @Get("/get/all")
    async getRole(){
        return this.roleService.getAllRoles(); 
    }

    @Delete(":name")
    async deleteRoleByName(@Param("name") roleName: string){
        const role = await this.roleRepository.getRoleByName(roleName);
        if(!role)
            throw new NotFoundException("Role was not found");
        await this.roleService.deleteRoleByName(role.name);
        return {message: "The role has been deleted successfully"};
    }

    @Patch(":name")
    async updateRoleByName(@Param("name") roleName: string ,@Body() dto:UpdateRoleDto){
        dto = updateRoleMapper.fromFrontToController(dto);
        const role = await this.roleRepository.getRoleByName(roleName);
        if(!role)
            throw new NotFoundException("Role was not found");
        const checkRoleUnique = await this.roleRepository.getRoleByName(dto.name);
        if(checkRoleUnique)
            throw new HttpException("Role with such name already exists",400);
        await this.roleRepository.updateRoleByName(roleName,dto);
        return {message: "The role has been updated successfully"};
    }
    
}