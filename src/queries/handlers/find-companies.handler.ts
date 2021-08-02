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
    const select = this.entityManager.createQueryBuilder(CompanyView, 'companyView');

    if (query.filter?.exchangeSymbols) {
      select.where('companyView.exchangeSymbol IN (:...exchangeSymbols)', {
        exchangeSymbols: query.filter.exchangeSymbols,
      })
    }

    if (query.filter?.scores) {
      const scores = query.filter.scores;

      select.andWhere(<CompanyView> {
        ...(scores.value && { valueScore: scores.value }),
        ...(scores.past && { pastScore: scores.past }),
        ...(scores.future && { futureScore: scores.future }),
        ...(scores.dividend && { dividendScore: scores.dividend }),
        ...(scores.health && { healthScore: scores.health })
      });
    }

    return select.getMany();
  }
}
