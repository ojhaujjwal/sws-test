import { QueryBus } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../queries/find-companies.query';
import { CompanyView } from '../entity/view/company.view';
import {
  ClassSerializerInterceptor,
  Controller,
  Get, Param, ParseUUIDPipe,
  Query, Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { QueryCompaniesRequest } from '../requests/query-companies.request';
import { paginationRoute } from './utils/paginationRoute';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetPriceTimelineQuery, Timeline } from '../queries/get-price-timeline.query';

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

  @Get('/:companyId/price-timeline')
  public async getPricesTimeline(
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Query('upto') upto?: string,
  ) {
    return {
      items: await this.queryBus.execute<GetPriceTimelineQuery, Timeline>(
        new GetPriceTimelineQuery(companyId, upto ? new Date(upto) : undefined)
      )
    };
  }
}
