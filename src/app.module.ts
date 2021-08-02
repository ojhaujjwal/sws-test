import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CompanyController } from './controllers/company.controller';
import { FindCompaniesHandler } from './queries/handlers/find-companies.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyView } from './entity/view/company.view';
import databaseConfig from './config/database';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([CompanyView])
  ],
  controllers: [CompanyController],
  providers: [FindCompaniesHandler],
})
export class AppModule {}
