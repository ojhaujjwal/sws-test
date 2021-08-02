enum AdditionalData {
  PRICES_TIMELINE = 'pricesTimeline'
}

enum OverAllScoreFilterOperator {
  MIN = 'min',
  MAX = 'max',
  EQUAL = 'equal',
}

type Filter =  {
  readonly exchangeSymbols: ReadonlyArray<string>,
  readonly overallScore: [OverAllScoreFilterOperator, number],
}

enum Sort {
  OVERALL_SCORE = 'overallScore',
  priceFluctuations = 'priceFluctuations',
}

export class FindCompaniesQuery {
    constructor(
      readonly additionalData?: AdditionalData,
      readonly filter?: Filter,
      readonly sort?: Sort,
    ) {}
}
