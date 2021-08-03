import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetPriceTimelineQuery,
  TimelineItem,
} from '../get-price-timeline.query';
import { Repository } from 'typeorm';
import { CompanyPriceCloseEntity } from '../../entity/company-price-close.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dateFormat = require('dateformat');

@Injectable()
@QueryHandler(GetPriceTimelineQuery)
export class GetPriceTimelineHandler
  implements IQueryHandler<GetPriceTimelineQuery>
{
  constructor(
    @InjectRepository(CompanyPriceCloseEntity)
    private readonly repository: Repository<CompanyPriceCloseEntity>,
  ) {}

  async execute(
    query: GetPriceTimelineQuery,
  ): Promise<ReadonlyArray<TimelineItem>> {
    const select = this.repository
      .createQueryBuilder('cpc')
      .where({ companyId: query.companyId })
      .andWhere('date >= :date', { date: dateFormat(query.upto, 'yyyy-mm-dd') })
      .orderBy('date', 'DESC');

    return (await select.getMany()).map(
      (row): TimelineItem => ({ price: row.price, date: row.date }),
    );
  }
}
