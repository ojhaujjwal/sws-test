import { Scores } from '../entity/types';

enum AdditionalData {
  PRICES_TIMELINE = 'pricesTimeline'
}

enum OverAllScoreFilterOperator {
  MIN = 'min',
  MAX = 'max',
  EQUAL = 'equal',
}

type Filter =  {
  readonly exchangeSymbols?: ReadonlyArray<string>,
  readonly scores?: Partial<Scores>;
}

export const SORT_FIELDS = ['scores.value', 'scores.past', 'scores.health', 'scores.future', 'scores.dividend', 'volatility'] as const;
export type SortField = typeof SORT_FIELDS[number];

type SortOperator = '-' | '';

export type SortTarget = `${SortOperator}${SortField}`;

export class FindCompaniesQuery {
    constructor(
      readonly filter?: Filter,
      readonly sort?: SortTarget,
      readonly additionalData?: AdditionalData,
    ) {}
}
