import { DataSource } from 'typeorm';
import { User } from '../src/modules/user/entities/user.entity';
import { Wedding } from '../src/modules/wedding/entities/wedding.entity';
import { WdWeb } from '../src/modules/wedding/entities/wd-web.entity';
import { WdCard } from '../src/modules/wedding/entities/wd-card.entity';
import { WeddingPackage } from '../src/modules/wedding/entities/wedding-package.entity';
import { Wallet } from '../src/modules/wallet/entities/wallet.entity';
import { Transaction } from '../src/modules/wallet/entities/transaction.entity';
import { News } from '../src/modules/news/entities/news.entity';
import { UserSubscription } from '../src/modules/user/entities/user-subscription.entity';

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '753951',
    database: 'binex',
    entities: [
      User,
      Wedding,
      WdWeb,
      WdCard,
      WeddingPackage,
      Wallet,
      Transaction,
      News,
      UserSubscription,
    ],
    synchronize: false,
  });

  try {
    console.log('Connecting to database...');
    await dataSource.initialize();
    console.log('Connected successfully!');

    const repo = dataSource.getRepository(Wallet);
    console.log('Running findAndCount with relations: [\'user\']...');
    const [data, total] = await repo.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    console.log('Success! Result:', { count: data.length, total });
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

main();
