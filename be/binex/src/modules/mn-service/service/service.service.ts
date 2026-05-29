import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository, In } from 'typeorm';
import { Sv_Pk } from './entities/sv-pk.entity';
import { SV_Micro } from './entities/sv-micro.entity';
import { PK_Micro } from '../packages/entities/pk-micro';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Sv_Pk)
    private readonly svPkRepository: Repository<Sv_Pk>,
    @InjectRepository(SV_Micro)
    private readonly svMicroRepository: Repository<SV_Micro>,
    @InjectRepository(PK_Micro)
    private readonly pkMicroRepository: Repository<PK_Micro>,
  ) {}

  create(createServiceDto: CreateServiceDto) {
    const newService = this.serviceRepository.create(createServiceDto);
    return this.serviceRepository.save(newService);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({ where: { id } });
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Không tìm thấy dịch vụ');
    }
    const updated = this.serviceRepository.merge(service, updateServiceDto);
    return this.serviceRepository.save(updated);
  }

  async remove(id: string) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Không tìm thấy dịch vụ');
    }
    return this.serviceRepository.remove(service);
  }

  async updatePackages(serviceId: string, packageIds: string[]) {
    // 1. Xóa các quan hệ cũ trong bảng sv_pk cho serviceId này
    await this.svPkRepository.delete({ serviceId });

    // 2. Thêm mới các quan hệ nếu có danh sách packageIds
    if (packageIds && packageIds.length > 0) {
      const svPks = packageIds.map((packageId) =>
        this.svPkRepository.create({ serviceId, packageId }),
      );
      await this.svPkRepository.save(svPks);
    }

    return {
      success: true,
      message: 'Cập nhật package cho service thành công',
    };
  }

  async findPackagesByService(serviceId: string, withMicroservices: boolean = false) {
    const relations = await this.svPkRepository.find({
      where: { serviceId },
      relations: ['package'],
    });
    const packages = relations.map((r) => r.package);

    if (withMicroservices && packages.length > 0) {
      const packageIds = packages.map((pkg) => pkg.id);
      const pkMicros = await this.pkMicroRepository.find({
        where: { packageId: In(packageIds) },
        relations: ['micro'],
      });

      const packageMicrosMap = new Map<string, any[]>();
      pkMicros.forEach((pm) => {
        if (pm.micro) {
          const list = packageMicrosMap.get(pm.packageId) || [];
          list.push(pm.micro);
          packageMicrosMap.set(pm.packageId, list);
        }
      });

      return packages.map((pkg) => ({
        ...pkg,
        microservices: packageMicrosMap.get(pkg.id) || [],
      }));
    }

    return packages;
  }

  async updateMicroServices(serviceId: string, microIds: string[]) {
    // 1. Xóa các quan hệ cũ trong bảng sv_micro cho serviceId này
    await this.svMicroRepository.delete({ serviceId });

    // 2. Thêm mới các quan hệ nếu có danh sách microIds
    if (microIds && microIds.length > 0) {
      const svMicros = microIds.map((microId) =>
        this.svMicroRepository.create({ serviceId, microId }),
      );
      await this.svMicroRepository.save(svMicros);
    }

    return {
      success: true,
      message: 'Cập nhật microservice cho service thành công',
    };
  }

  async findMicroServicesByService(serviceId: string) {
    const relations = await this.svMicroRepository.find({
      where: { serviceId },
      relations: ['micro'],
    });
    return relations.map((r) => r.micro);
  }
}
