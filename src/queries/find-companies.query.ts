import { Scores } from '../entity/types';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

type Filter = {
  readonly exchangeSymbols?: ReadonlyArray<string>;
  readonly scores?: Partial<Scores>;
};

export const SORT_FIELDS = [
  'scores.value',
  'scores.past',
  'scores.health',
  'scores.future',
  'scores.dividend',
  'volatility',
] as const;
export type SortField = typeof SORT_FIELDS[number];

type SortOperator = '-' | '';

export type SortTarget = `${SortOperator}${SortField}`;

export class FindCompaniesQuery {
  constructor(
    readonly paginationOptions: IPaginationOptions,
    readonly filter?: Filter,
    readonly sort?: SortTarget,
  ) {}
}
