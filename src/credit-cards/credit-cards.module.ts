import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsEntity } from './credit-cards.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [CreditCardsService],
  controllers: [CreditCardsController],
  exports: [CreditCardsService],
  imports: [TypeOrmModule.forFeature([CreditCardsEntity]), UsersModule],
})
export class CreditCardsModule {}
