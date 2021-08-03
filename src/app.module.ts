import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CompanyController } from './controllers/company.controller';
import { FindCompaniesHandler } from './queries/handlers/find-companies.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database';
import { GetPriceTimelineHandler } from './queries/handlers/get-price-timeline.handler';
import { CompanyPriceCloseEntity } from './entity/company-price-close.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([CompanyPriceCloseEntity]),
  ],
  controllers: [CompanyController],
  providers: [FindCompaniesHandler, GetPriceTimelineHandler],
})
export class AppModule {}
