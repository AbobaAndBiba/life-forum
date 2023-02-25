import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleController } from "./role.controller";
import { RoleRepository } from "./role.repository";
import { RoleService } from "./role.service";
import { Role, RoleSchema } from "./shemas/role.schemas";

const roleFeature = MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])

@Module({
  imports: [roleFeature],
  controllers: [RoleController],
  providers: [RoleService,RoleRepository],
  exports: []
})
export class RoleModule {} 