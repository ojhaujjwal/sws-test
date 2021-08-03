import { QueryBus } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../queries/find-companies.query';
import { CompanyView } from '../entity/view/company.view';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query, Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { QueryCompaniesRequest } from '../requests/query-companies.request';
import { paginationRoute } from './utils/paginationRoute';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('/api/v1/companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
  }

  @Get()
  public async findPaginated(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, transformOptions: { exposeDefaultValues: true } }))
      query: QueryCompaniesRequest,
  ): Promise<Pagination<CompanyView>> {
    return this.queryBus.execute(new FindCompaniesQuery(
      {
        page: query.page,
        limit: query.perPage,
        route: paginationRoute(req),
      },
      {
        exchangeSymbols: query.exchangeSymbols,
        scores: query.scores,
      },
      query.sort,
    ));
  }
}
