import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../find-companies.query';
import { CompanyView } from '../../entity/view/company.view';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@QueryHandler(FindCompaniesQuery)
@Injectable()
export class FindCompaniesHandler implements IQueryHandler<FindCompaniesQuery> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {
  }

  execute(query: FindCompaniesQuery): Promise<ReadonlyArray<CompanyView>> {
    return this.entityManager.createQueryBuilder(CompanyView, 'companyView')
      .getMany();
  }
}
