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

export enum Sort {
  OVERALL_SCORE = 'overallScore',
  priceFluctuations = 'priceFluctuations',
}

export class FindCompaniesQuery {
    constructor(
      readonly filter?: Filter,
      readonly sort?: Sort,
      readonly additionalData?: AdditionalData,
    ) {}
}
