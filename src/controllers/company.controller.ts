import { QueryBus } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../queries/find-companies.query';
import { CompanyView } from '../entity/view/company.view';
import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { QueryCompaniesRequest } from '../requests/query-companies.request';

@Controller('/api/v1/companies')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
  }

  @Get()
  public async findPaginated(
    @Query(new ValidationPipe({ transform: true })) query: QueryCompaniesRequest,
  ): Promise<ReadonlyArray<CompanyView>> {
    return this.queryBus.execute(new FindCompaniesQuery(
      {
        exchangeSymbols: query.exchangeSymbols,
        scores: query.scores,
      },
      query.sort,
    ));
  }
}
