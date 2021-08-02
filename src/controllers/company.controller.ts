import { QueryBus } from '@nestjs/cqrs';
import { FindCompaniesQuery } from '../queries/find-companies.query';
import { CompanyView } from '../entity/view/company.view';
import { Controller, Get } from '@nestjs/common';

@Controller('/api/v1/companies')
export class CompanyController {
  constructor(
    private readonly queryBus: QueryBus,
  ) {
  }

  @Get()
  public async findPaginated()
  {
    const companies: ReadonlyArray<CompanyView> = await this.queryBus.execute(new FindCompaniesQuery());

    return companies;
  }
}
