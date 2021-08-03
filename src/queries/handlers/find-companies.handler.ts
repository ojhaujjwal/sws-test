import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../find-companies.query';
import { CompanyView } from '../../entity/view/company.view';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

@QueryHandler(FindCompaniesQuery)
@Injectable()
export class FindCompaniesHandler implements IQueryHandler<FindCompaniesQuery> {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async execute(query: FindCompaniesQuery): Promise<Pagination<CompanyView>> {
    const select = this.entityManager.createQueryBuilder(CompanyView, 'cv');

    if (query.filter?.exchangeSymbols) {
      select.where('cv.exchangeSymbol IN (:...exchangeSymbols)', {
        exchangeSymbols: query.filter.exchangeSymbols,
      });
    }

    if (query.filter?.scores) {
      const scores = query.filter.scores;

      select.andWhere(<CompanyView>{
        ...(scores.value && { valueScore: scores.value }),
        ...(scores.past && { pastScore: scores.past }),
        ...(scores.future && { futureScore: scores.future }),
        ...(scores.dividend && { dividendScore: scores.dividend }),
        ...(scores.health && { healthScore: scores.health }),
      });
    }

    this.addSortToSelect(select, query);

    return paginate<CompanyView>(select, query.paginationOptions);
  }

  private addSortToSelect(
    select: SelectQueryBuilder<CompanyView>,
    query: FindCompaniesQuery,
  ): void {
    if (!query.sort) {
      return;
    }

    if (query.sort === 'volatility') {
      return this.sortByVolatility(select);
    }

    if (query.sort === '-volatility') {
      return this.sortByVolatility(select, false);
    }

    const sortColumn = `cv.${query.sort.replace(/-/g, '').split('.')[1]}Score`;

    select.orderBy(
      sortColumn,
      query.sort.startsWith('-') ? 'DESC' : 'ASC',
      'NULLS LAST',
    );
  }

  private sortByVolatility(
    select: SelectQueryBuilder<CompanyView>,
    isAscendingOrder = true,
  ): void {
    select
      .leftJoin('swsCompanyPriceClose', 'cpc', 'cv.id = cpc.company_id', {})
      .groupBy('cv.id')
      .addSelect(
        '(AVG(cpc.price*cpc.price) - AVG(cpc.price)*AVG(cpc.price))',
        'variance',
      )
      .orderBy('variance', isAscendingOrder ? 'ASC' : 'DESC', 'NULLS LAST');
  }
}
