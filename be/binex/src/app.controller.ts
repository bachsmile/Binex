import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { AuthGuard } from './modules/mn-user/auth/guards/auth.guard';
import { RolesGuard } from './modules/mn-user/auth/guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './modules/mn-user/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('dev/reset-db')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiTags('dev')
  @ApiOperation({
    summary: '⚠️ Xoá toàn bộ dữ liệu trong database (SUPER_ADMIN only)',
  })
  async resetDatabase() {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const tableName = entity.tableName;
      await this.dataSource.query(`TRUNCATE TABLE "${tableName}" CASCADE`);
    }

    return {
      message: 'Đã xoá sạch toàn bộ dữ liệu trong database',
      tablesCleared: entities.map((e) => e.tableName),
    };
  }
}
