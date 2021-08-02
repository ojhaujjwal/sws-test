import { ViewColumn, ViewEntity } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Scores } from '../types';

@ViewEntity({
  expression: `
    select 
        c.id,
        c.name,
        c.unique_symbol,
        c.exchange_symbol,
        cs.value as value_score,
        cs.past as past_score,
        cs.future as future_score,
        cs.dividend as dividend_score,
        cs.health as health_score,
        cpc.price as last_closing_price,
        max(cpc.date)
    from swsCompany c 
    left JOIN swsCompanyScore cs on c.id = cs.company_id
    left join swsCompanyPriceClose cpc on c.id = cpc.company_id
    group by c.id 
  `,
  name: 'companies_view',
})
export class CompanyView {
  @ViewColumn()
  readonly id: string;

  @ViewColumn()
  readonly name: string;

  @ViewColumn({ name: 'exchange_symbol' })
  readonly exchangeSymbol;

  @ViewColumn({ name: 'unique_symbol' })
  readonly uniqueSymbol;

  @ViewColumn({ name: 'last_closing_price' })
  readonly lastClosingPrice: number;

  @Exclude()
  @ViewColumn({ name: 'past_score' })
  readonly pastScore;

  @Exclude()
  @ViewColumn({ name: 'future_score' })
  readonly futureScore;

  @Exclude()
  @ViewColumn({ name: 'dividend_score' })
  readonly dividendScore;

  @Exclude()
  @ViewColumn({ name: 'value_score' })
  readonly valueScore;

  @Exclude()
  @ViewColumn({ name: 'health_score' })
  readonly healthScore;

  @Expose()
  get scores(): Scores {
    return {
      past: this.pastScore,
      future: this.futureScore,
      dividend: this.dividendScore,
      value: this.valueScore,
      health: this.healthScore,
    };
  }
}
