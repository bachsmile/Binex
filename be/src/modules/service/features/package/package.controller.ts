import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from '../../dto/package/create-package.dto';
import { UpdatePackageDto } from '../../dto/package/update-package.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/modules/auth/enums/role.enum';
import { UpdatePackageRecordLimitDto } from '../../dto/package/update-record-limit.dto';
import { GetPackagesByIdsDto } from '../../dto/package/get-packages-by-ids.dto';

@ApiTags('package')
@ApiBearerAuth('JWT-auth')
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Patch(':id/record-limit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Gán key và giá trị giới hạn bản ghi cho Package' })
  updateRecordLimit(
    @Param('id') id: string,
    @Body() data: UpdatePackageRecordLimitDto,
  ) {
    return this.packageService.updateRecordLimit(id, data.key, data.value);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  create(@Body() createPackageDto: CreatePackageDto) {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  findAll() {
    return this.packageService.findAll();
  }

  @Post('details')
  findDetailsByIds(@Body() payload: GetPackagesByIdsDto) {
    return this.packageService.findByIds(payload.ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageService.remove(id);
  }

  @Delete()
  removeAll() {
    return this.packageService.removeAll();
  }
}
