import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    this.logger.log(`Creating order for user ${userId} with amount ${createOrderDto.amount}`);
    const order = this.orderRepository.create({
      ...createOrderDto,
      userId,
    });
    return await this.orderRepository.save(order);
  }

  async findAll(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { id },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, transactionId?: string): Promise<Order> {
    this.logger.log(`Updating order ${id} payment status to ${paymentStatus}`);
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }
    return await this.orderRepository.save(order);
  }
}
