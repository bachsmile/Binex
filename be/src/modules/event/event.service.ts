import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const event = this.eventRepository.create({
      ...createEventDto,
      createdBy: userId,
    });
    return await this.eventRepository.save(event);
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const [data, total] = await this.eventRepository.findAndCount({
      where: { createdBy: userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['wedding'],
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    return await this.eventRepository.remove(event);
  }

  async updateParticipants(
    id: string,
    updateParticipantsDto: import('./dto/update-participants.dto').UpdateParticipantsDto,
  ) {
    const event = await this.findOne(id);
    event.participantIds = updateParticipantsDto.participantIds;
    return await this.eventRepository.save(event);
  }
}
