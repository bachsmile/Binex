import { Injectable } from '@nestjs/common';
import { CreateMicroServiceDto } from './dto/create-micro-service.dto';
import { UpdateMicroServiceDto } from './dto/update-micro-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MicroService } from './entities/micro-service.entity';
import { Repository } from 'typeorm';
import { Sv_Pk } from '../service/entities/sv-pk.entity';
import { SV_Micro } from '../service/entities/sv-micro.entity';
import { PK_Micro } from '../packages/entities/pk-micro';

@Injectable()
export class MicroServiceService {
  constructor(
    @InjectRepository(MicroService)
    private readonly microServiceRepository: Repository<MicroService>,
    @InjectRepository(Sv_Pk)
    private readonly svPkRepository: Repository<Sv_Pk>,
    @InjectRepository(SV_Micro)
    private readonly svMicroRepository: Repository<SV_Micro>,
    @InjectRepository(PK_Micro)
    private readonly pkMicroRepository: Repository<PK_Micro>,
  ) {}

  async create(createMicroServiceDto: CreateMicroServiceDto) {
    const checkCode = await this.microServiceRepository.findOne({
      where: { code: createMicroServiceDto.code },
    });
    if (checkCode) {
      throw new Error('Code đã tồn tại');
    }
    const newMicroService = this.microServiceRepository.create(
      createMicroServiceDto,
    );
    return this.microServiceRepository.save(newMicroService);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [result, total] = await this.microServiceRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  findOne(id: string) {
    return this.microServiceRepository.findOne({ where: { id } });
  }

  async update(id: string, updateMicroServiceDto: UpdateMicroServiceDto) {
    const checkCode = await this.microServiceRepository.findOne({
      where: { id },
    });
    if (!checkCode) {
      throw new Error('Không tìm thấy microService');
    }
    const updateMicroService = this.microServiceRepository.merge(
      checkCode,
      updateMicroServiceDto,
    );
    return await this.microServiceRepository.save(updateMicroService);
  }

  async remove(id: string) {
    const checkCode = await this.microServiceRepository.findOne({
      where: { id },
    });
    if (!checkCode) {
      throw new Error('Không tìm thấy microService');
    }
    return await this.microServiceRepository.remove(checkCode);
  }

  async findServicesByMicroService(microId: string) {
    const relations = await this.svMicroRepository.find({
      where: { microId },
      relations: ['service'],
    });
    return relations.map((r) => r.service);
  }

  async findPackagesByMicroService(microId: string) {
    const relations = await this.pkMicroRepository.find({
      where: { microId },
      relations: ['package'],
    });
    return relations.map((r) => r.package);
  }
}
