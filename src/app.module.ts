import { Module } from '@nestjs/common';
import { AppImportsLoader } from './app-imports-loader';
import { RoleModule } from './role/role.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ...AppImportsLoader.load('configs/imports/*.imports.{ts,js}'),
    TagsModule,
    RoleModule
  ]
})
export class AppModule {}
