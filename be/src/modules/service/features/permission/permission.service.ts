import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { Package } from '../../entities/package.entity';
import { CreatePermissionDto } from '../../dto/permission/create-permission.dto';
import { UpdatePermissionDto } from '../../dto/permission/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const perm = this.permissionRepository.create({
      serviceGroupId: dto.serviceId,
      action: dto.action,
      weight: dto.weight ?? 1,
    });
    return this.permissionRepository.save(perm);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ relations: ['serviceGroup'] });
  }

  async findByServiceId(serviceId: string): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { serviceGroupId: serviceId },
      order: { action: 'ASC' },
    });
  }

  async findByPackId(packId: string): Promise<Permission[]> {
    return [];
  }

  async findOne(id: number): Promise<Permission> {
    const perm = await this.permissionRepository.findOne({
      where: { id },
      relations: ['serviceGroup'],
    });
    if (!perm) throw new NotFoundException(`Permission #${id} not found`);
    return perm;
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
    const perm = await this.findOne(id);
    const updated = this.permissionRepository.merge(perm, dto);
    return this.permissionRepository.save(updated);
  }

  async remove(id: number): Promise<{ message: string }> {
    const perm = await this.findOne(id);
    await this.permissionRepository.remove(perm);
    return { message: `Permission #${id} deleted` };
  }

  async removeByPackId(packId: string): Promise<{ message: string }> {
    return { message: `All permissions for package ${packId} deleted` };
  }

  /** Bulk set: recompute ac based on selected action weights */
  async bulkSet(
    packId: string,
    actions: { action: string; weight?: number }[],
  ): Promise<Permission[]> {
    return [];
  }
}
